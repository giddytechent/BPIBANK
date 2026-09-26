import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@/generated/prisma/client";
import { adminProcedure, router } from "../init";

const transactionListInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  search: z.string().trim().max(100).default(""),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "TRANSFER"]).optional(),
  userId: z.string().min(1).optional(),
});

const updateUserProfileInput = z
  .object({
    userId: z.string().min(1),
    name: z.string().trim().min(2).max(50).nullable().optional(),
    email: z.email().transform((value) => value.trim().toLowerCase()).optional(),
    city: z.string().trim().min(2).max(100).nullable().optional(),
    country: z.string().trim().min(2).max(100).nullable().optional(),
  })
  .refine(
    ({ name, email, city, country }) =>
      name !== undefined || email !== undefined || city !== undefined || country !== undefined,
    "Provide at least one profile field to update.",
  );

const adminDepositInput = z.object({
  accountId: z.string().min(1),
  amount: z.number().int().positive().max(2_147_483_647),
});

const editTransactionInput = z
  .object({
    transactionId: z.string().min(1),
    amount: z.number().int().positive().max(2_147_483_647).optional(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED"]).optional(),
    dateTime: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date and time.")
      .optional(),
  })
  .refine(
    ({ amount, status, dateTime }) =>
      amount !== undefined || status !== undefined || dateTime !== undefined,
    "Change at least one transaction field.",
  );

function getTransactionBalanceEffects(
  transaction: {
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
    amount: number;
    status: "PENDING" | "COMPLETED" | "FAILED";
    senderAccountId: string | null;
    receiverAccountId: string | null;
    receiverUserId: string | null;
  },
) {
  const effects = new Map<string, number>();
  if (transaction.status !== "COMPLETED") return effects;

  const add = (accountId: string | null, amount: number) => {
    if (!accountId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "This transaction no longer has all account links needed to reconcile its balance.",
      });
    }
    effects.set(accountId, (effects.get(accountId) ?? 0) + amount);
  };

  if (transaction.type === "DEPOSIT") {
    add(transaction.receiverAccountId, transaction.amount);
  } else if (transaction.type === "WITHDRAWAL") {
    add(transaction.senderAccountId, -transaction.amount);
  } else {
    add(transaction.senderAccountId, -transaction.amount);
    if (transaction.receiverUserId && !transaction.receiverAccountId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "The recipient account was removed, so this transaction cannot be reconciled.",
      });
    }
    if (transaction.receiverAccountId) {
      if (transaction.amount <= 1000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A completed transfer amount must exceed the 10.00 transfer fee.",
        });
      }
      add(transaction.receiverAccountId, transaction.amount - 1000);
    }
  }

  return effects;
}

export const adminRouter = router({
  editTransaction: adminProcedure
    .input(editTransactionInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.findUnique({
          where: { id: input.transactionId },
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            senderAccountId: true,
            receiverAccountId: true,
            receiverUserId: true,
          },
        });
        if (!transaction) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Transaction not found." });
        }

        const nextAmount = input.amount ?? transaction.amount;
        const nextStatus = input.status ?? transaction.status;
        const nextCreatedAt = input.dateTime ? new Date(input.dateTime) : transaction.createdAt;
        if (
          transaction.type === "TRANSFER" &&
          nextStatus === "COMPLETED" &&
          nextAmount <= 1000
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A transfer amount must exceed the 10.00 transfer fee.",
          });
        }
        if (
          nextAmount === transaction.amount &&
          nextStatus === transaction.status &&
          nextCreatedAt.getTime() === transaction.createdAt.getTime()
        ) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "No transaction values changed." });
        }

        const financialValuesChanged =
          nextAmount !== transaction.amount || nextStatus !== transaction.status;
        const oldEffects = financialValuesChanged
          ? getTransactionBalanceEffects(transaction)
          : new Map<string, number>();
        const newEffects = financialValuesChanged
          ? getTransactionBalanceEffects({
              ...transaction,
              amount: nextAmount,
              status: nextStatus,
            })
          : new Map<string, number>();
        const deltas = new Map<string, number>();
        for (const [accountId, amount] of oldEffects) {
          deltas.set(accountId, (deltas.get(accountId) ?? 0) - amount);
        }
        for (const [accountId, amount] of newEffects) {
          deltas.set(accountId, (deltas.get(accountId) ?? 0) + amount);
        }

        const affectedAccountIds = [...deltas.keys()];
        const accounts = affectedAccountIds.length
          ? await tx.account.findMany({
              where: { id: { in: affectedAccountIds } },
              select: { id: true, balance: true },
            })
          : [];
        const accountsById = new Map(accounts.map((account) => [account.id, account]));

        for (const [accountId, delta] of deltas) {
          const account = accountsById.get(accountId);
          if (!account) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "An affected account no longer exists, so this transaction cannot be reconciled.",
            });
          }

          const nextBalance = account.balance + delta;
          if (nextBalance < 0) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "This change would make an account balance negative.",
            });
          }
          if (nextBalance > 2_147_483_647) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "This change would exceed the account balance limit.",
            });
          }
        }

        for (const [accountId, delta] of deltas) {
          if (delta === 0) continue;
          const account = accountsById.get(accountId)!;
          const updated = await tx.account.updateMany({
            where: { id: accountId, balance: account.balance },
            data: { balance: { increment: delta } },
          });
          if (updated.count !== 1) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "An affected account changed during this edit. Refresh and try again.",
            });
          }
        }

        const transactionWrite = await tx.transaction.updateMany({
          where: { id: transaction.id, updatedAt: transaction.updatedAt },
          data: {
            amount: nextAmount,
            status: nextStatus,
            createdAt: nextCreatedAt,
          },
        });
        if (transactionWrite.count !== 1) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "The transaction changed during this edit. Refresh and try again.",
          });
        }

        const updatedTransaction = await tx.transaction.findUniqueOrThrow({
          where: { id: transaction.id },
          select: {
            id: true,
            type: true,
            amount: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        await tx.transactionAudit.create({
          data: {
            transactionId: transaction.id,
            actorUserId: ctx.session.user.id,
            previousAmount: transaction.amount,
            newAmount: nextAmount,
            previousStatus: transaction.status,
            newStatus: nextStatus,
            previousCreatedAt: transaction.createdAt,
            newCreatedAt: nextCreatedAt,
          },
        });

        return { transaction: updatedTransaction, balancesReconciled: true };
      });
    }),

  getTransactionAudit: adminProcedure
    .input(z.object({ transactionId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.transactionAudit.findMany({
        where: { transactionId: input.transactionId },
        select: {
          id: true,
          previousAmount: true,
          newAmount: true,
          previousStatus: true,
          newStatus: true,
          previousCreatedAt: true,
          newCreatedAt: true,
          changedAt: true,
          actor: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ changedAt: "desc" }, { id: "desc" }],
      });
    }),

  updateUserProfile: adminProcedure
    .input(updateUserProfileInput)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: { id: true },
      });
      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      }

      if (input.email) {
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email: input.email },
          select: { id: true },
        });

        if (existingUser && existingUser.id !== input.userId) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That email address is already in use.",
          });
        }
      }

      try {
        return await ctx.prisma.user.update({
          where: { id: input.userId },
          data: {
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.email !== undefined ? { email: input.email } : {}),
            ...(input.city !== undefined ? { city: input.city } : {}),
            ...(input.country !== undefined ? { country: input.country } : {}),
          },
          select: {
            id: true,
            name: true,
            email: true,
            city: true,
            country: true,
            role: true,
            updatedAt: true,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That email address is already in use.",
          });
        }
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "The user profile could not be updated.",
        });
      }
    }),

  deposit: adminProcedure
    .input(adminDepositInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const account = await tx.account.findUnique({
          where: { id: input.accountId },
          select: { id: true, userId: true, currency: true },
        });

        if (!account) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Account not found." });
        }

        const updated = await tx.account.updateMany({
          where: {
            id: account.id,
            balance: { lte: 2_147_483_647 - input.amount },
          },
          data: { balance: { increment: input.amount } },
        });

        if (updated.count !== 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The deposit would exceed the account balance limit.",
          });
        }

        const transaction = await tx.transaction.create({
          data: {
            type: "DEPOSIT",
            status: "COMPLETED",
            amount: input.amount,
            currency: account.currency,
            description: "Admin deposit",
            receiverUserId: account.userId,
            receiverAccountId: account.id,
          },
          select: {
            id: true,
            amount: true,
            currency: true,
            status: true,
            createdAt: true,
          },
        });

        const updatedAccount = await tx.account.findUniqueOrThrow({
          where: { id: account.id },
          select: { id: true, accountNumber: true, balance: true, currency: true },
        });

        return { account: updatedAccount, transaction };
      });
    }),

  deleteAccount: adminProcedure
    .input(z.object({ accountId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const account = await tx.account.findUnique({
          where: { id: input.accountId },
          select: {
            id: true,
            accountNumber: true,
            balance: true,
            currency: true,
            user: { select: { id: true, name: true, email: true } },
          },
        });

        if (!account) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Account not found." });
        }

        if (account.balance !== 0) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "An account must have a zero balance before it can be deleted.",
          });
        }

        const transactionCount = await tx.transaction.count({
          where: {
            OR: [
              { senderAccountId: account.id },
              { receiverAccountId: account.id },
            ],
          },
        });

        const deleted = await tx.account.deleteMany({
          where: { id: account.id, balance: 0 },
        });
        if (deleted.count !== 1) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "The account balance changed. Refresh the account and try again.",
          });
        }

        return {
          deletedAccount: {
            id: account.id,
            accountNumber: account.accountNumber,
            balance: account.balance,
            currency: account.currency,
            owner: account.user,
          },
          detachedTransactionCount: transactionCount,
          transactionHistoryPreserved: true,
          balanceRemoved: 0,
        };
      });
    }),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: input.userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            accounts: {
              select: { id: true, balance: true, accountNumber: true, currency: true },
            },
            _count: { select: { cards: true } },
          },
        });

        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
        }
        if (user.role === "ADMIN") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Admin users cannot be deleted through this action.",
          });
        }
        if (user.accounts.some((account) => account.balance !== 0)) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "All of the user accounts must have zero balances before deletion.",
          });
        }

        const accountIds = user.accounts.map((account) => account.id);
        const transactionCount = await tx.transaction.count({
          where: {
            OR: [
              { senderUserId: user.id },
              { receiverUserId: user.id },
              ...(accountIds.length > 0
                ? [
                    { senderAccountId: { in: accountIds } },
                    { receiverAccountId: { in: accountIds } },
                  ]
                : []),
            ],
          },
        });

        const deletedAccounts = await tx.account.deleteMany({
          where: { userId: user.id, balance: 0 },
        });
        if (deletedAccounts.count !== user.accounts.length) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "An account balance changed. Refresh the user and try again.",
          });
        }

        const deleted = await tx.user.deleteMany({
          where: { id: user.id, role: "USER" },
        });
        if (deleted.count !== 1) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "The user changed while deletion was in progress. Refresh and try again.",
          });
        }

        return {
          deletedUser: { id: user.id, name: user.name, email: user.email },
          deletedAccountCount: deletedAccounts.count,
          deletedCardCount: user._count.cards,
          detachedTransactionCount: transactionCount,
          transactionHistoryPreserved: true,
        };
      });
    }),

  getTransactions: adminProcedure
    .input(transactionListInput)
    .query(async ({ ctx, input }) => {
      const search = input.search;
      const conditions: Prisma.TransactionWhereInput[] = [];

      if (search) {
        conditions.push({
          OR: [
            { id: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            {
              senderUser: {
                is: {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            },
            {
              receiverUser: {
                is: {
                  OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                  ],
                },
              },
            },
            { senderAccount: { is: { accountNumber: { contains: search } } } },
            { receiverAccount: { is: { accountNumber: { contains: search } } } },
          ],
        });
      }

      if (input.userId) {
        conditions.push({
          OR: [
            { senderUserId: input.userId },
            { receiverUserId: input.userId },
          ],
        });
      }

      const where: Prisma.TransactionWhereInput = {
        ...(input.status ? { status: input.status } : {}),
        ...(input.type ? { type: input.type } : {}),
        ...(conditions.length > 0 ? { AND: conditions } : {}),
      };

      const [total, items] = await ctx.prisma.$transaction([
        ctx.prisma.transaction.count({ where }),
        ctx.prisma.transaction.findMany({
          where,
          select: {
            id: true,
            type: true,
            status: true,
            amount: true,
            currency: true,
            description: true,
            createdAt: true,
            senderUser: {
              select: { id: true, name: true, email: true },
            },
            receiverUser: {
              select: { id: true, name: true, email: true },
            },
            senderAccount: {
              select: { id: true, accountNumber: true, type: true },
            },
            receiverAccount: {
              select: { id: true, accountNumber: true, type: true },
            },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (input.page - 1) * input.pageSize,
          take: input.pageSize,
        }),
      ]);

      return {
        items,
        total,
        page: input.page,
        pageSize: input.pageSize,
        pageCount: Math.ceil(total / input.pageSize),
      };
    }),
});
