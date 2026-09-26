import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  protectedProcedure,
  adminProcedure,
  router,
} from "../init";

const userListInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(25),
  search: z.string().trim().max(100).default(""),
});

export const userRouter = router({
  getById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          email: true,
          name: true,
          city: true,
          country: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          accounts: {
            select: {
              id: true,
              accountNumber: true,
              type: true,
              balance: true,
              currency: true,
              createdAt: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }),

  getAll: adminProcedure.input(userListInput).query(async ({ ctx, input }) => {
    const search = input.search;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, users] = await ctx.prisma.$transaction([
      ctx.prisma.user.count({ where }),
      ctx.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          city: true,
          country: true,
          role: true,
          createdAt: true,
          _count: { select: { accounts: true } },
          accounts: { select: { balance: true, currency: true } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
    ]);

    return {
      items: users.map(({ _count, accounts, ...user }) => ({
        ...user,
        accountCount: _count.accounts,
        balances: accounts.reduce<Record<string, number>>((totals, account) => {
          totals[account.currency] = (totals[account.currency] ?? 0) + account.balance;
          return totals;
        }, {}),
      })),
      total,
      page: input.page,
      pageSize: input.pageSize,
      pageCount: Math.ceil(total / input.pageSize),
    };
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  hasTransactionPin: protectedProcedure.query(async ({ ctx })=> {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        transactionPinHash: true
      }
    })

    return {
      hasPin: Boolean(user?.transactionPinHash)
    }
  }),

  setTransactionPin: protectedProcedure
    .input(
    z.object({
      pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits.")
    })
  )
  .mutation(async ({ctx, input})=> {
    const transactionPinHash = await bcrypt.hash(
      input.pin,
      12
    )

    await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id
      },
      data: {
        transactionPinHash
      }
    })

    return {
      success: true,
      message: "Transaction PIN set successfully"
    }
  }),

  updateProfile: protectedProcedure.input(
    z.object({
      name: z.string().min(2).max(50),
      city: z.string().min(2).max(100),
      country: z.string().min(2).max(100)
    })
  )
  .mutation(async ({ ctx,input })=> {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        name: input.name,
        city: input.city,
        country: input.country
      },
      select: {
        id: true,
        name: true,
        email: true,
        city: true,
        country: true
      }
    })
  })
});
