import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { protectedProcedure, router } from "../init"
import { generateAccountNumber } from "../utils/accountNumber"
import bcrypt from "bcryptjs"

const TRANSFER_FEE_CENTS = 1000

export const accountRouter = router({
    getMyAccounts: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.account.findMany({
            where: {
                userId: ctx.session.user.id
            },
            orderBy: {
                createdAt: "asc"
            }
        })
    }),
    getMyTransactions: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.transaction.findMany({
            where: {
                OR: [
                    { senderUserId: ctx.session.user.id },
                    { receiverUserId: ctx.session.user.id },
                ],
            },
            include: {
                senderAccount: {
                    select: {
                        id: true,
                        accountNumber: true,
                        type: true,
                    },
                },
                receiverAccount: {
                    select: {
                        id: true,
                        accountNumber: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),
    getById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findFirst({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id
                }
            })
            if (!account) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found"
                })
            }
            return account
        }),
    create: protectedProcedure.input(
        z.object({
            type: z.enum(["CHECKING", "SAVINGS"])
        })
    )
        .mutation(async ({ ctx, input }) => {
            const accountNumber = await generateAccountNumber(ctx.prisma)
            return ctx.prisma.account.create({
                data: {
                    accountNumber,
                    type: input.type,
                    userId: ctx.session.user.id,
                    balance: 0,
                    currency: "USD"
                }
            })
        }),
    getTransactions: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const account =
                await ctx.prisma.account.findFirst({
                    where: {
                        id: input.accountId,
                        userId: ctx.session.user.id,
                    },
                });

            if (!account) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found",
                });
            }

            return ctx.prisma.transaction.findMany({
                where: {
                    OR: [
                        {
                            senderAccountId: account.id,
                        },
                        {
                            receiverAccountId: account.id,
                        },
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }),
    deposit: protectedProcedure
        .input(
            z.object({
                accountId: z.string(),
                amount: z.number().int().positive(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const account =
                await ctx.prisma.account.findFirst({
                    where: {
                        id: input.accountId,
                        userId: ctx.session.user.id,
                    },
                });

            if (!account) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Account not found",
                });
            }

            const result = await ctx.prisma.$transaction(
                async (tx) => {
                    const updatedAccount =
                        await tx.account.update({
                            where: {
                                id: account.id,
                            },
                            data: {
                                balance: {
                                    increment: input.amount,
                                },
                            },
                        });

                    const transaction =
                        await tx.transaction.create({
                            data: {
                                type: "DEPOSIT",
                                status: "COMPLETED",
                                amount: input.amount,
                                currency: account.currency,
                                receiverUserId:
                                    ctx.session.user.id,
                                receiverAccountId: account.id,
                                description: "Deposit",
                            },
                        });

                    return {
                        account: updatedAccount,
                        transaction,
                    };
                },
            );

            return result;
        }),

    lookupRecipient: protectedProcedure.input(
        z.object({
            accountRouter: z.string().regex(/^\d{10}$/, "Account number must be 10 digits.")
        })
    )
        .query(async ({ ctx, input }) => {
            const account = await ctx.prisma.account.findUnique({
                where: {
                    accountNumber: input.accountRouter
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            city: true,
                            country: true
                        }
                    }
                }
            })

            if(!account) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Recipient account not found."
                })
            }

            if (account.userId === ctx.session.user.id) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "You cannot transfer money to your own account."
                })
            }

            return {
                name: account.user.name,
                accountNumber: account.accountNumber,
                city: account.user.city,
                country: account.user.country
            }
        }),
    transfer: protectedProcedure.input(
        z.object({
            senderAccountId: z.string(),
            recipientBankName: z.string().trim().min(2, "Bank name is required.").max(50, "Bank name is too long."),
            recipientAccountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits."),
            amount: z.number().int().positive("Amount must be greater than zero."),
            transactionPin: z.string().regex(/^\d{6}$/, "Transaction PIN must be 6 digits."),
            description: z.string().trim().max(200).optional()
        }),
    )
    .mutation(async ({ ctx, input })=>{
        const totalDebit = input.amount + TRANSFER_FEE_CENTS

        const senderAccount = await ctx.prisma.account.findFirst({
            where: {
                id: input.senderAccountId,
                userId: ctx.session.user.id,
            }
        })
        if(!senderAccount){
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Sender account not found."
            })
        }

        const recipientAccount = await ctx.prisma.account.findUnique({
            where: {
                accountNumber: input.recipientAccountNumber,
            },
            include: {
                user: true
            }
        })
        if(recipientAccount?.userId === ctx.session.user.id){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "You cannot transfer money to your own account."
            })
        }

        const senderUser = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                transactionPinHash: true
            }
        })

        if (!senderUser?.transactionPinHash) {
            throw new TRPCError({
                code: "PRECONDITION_FAILED",
                message: "You must set your transaction PIN in settings before making a transfer."
            })
        }

        const pinIsValid = await bcrypt.compare(
            input.transactionPin,
            senderUser.transactionPinHash,
        )
        if(!pinIsValid) {
            await ctx.prisma.transaction.create({
                data: {
                    type: "TRANSFER",
                    status: "FAILED",
                    amount: input.amount,
                    currency: senderAccount.currency,
                    description: input.description ?? "Failed transfer - incorrect PIN",
                    recipientBankName: input.recipientBankName,
                    senderUserId: ctx.session.user.id,
                    senderAccountId: senderAccount.id,
                    ...(recipientAccount && {
                        receiverUserId: recipientAccount.userId,
                        receiverAccountId: recipientAccount.id,
                    }),
                }
            })
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Transfer failed. Incorrect transaction PIN."
            })
        }

        const transaction = await ctx.prisma.$transaction(
            async (tx) => {
                const debit = await tx.account.updateMany({
                    where: {
                        id: senderAccount.id,
                        userId: ctx.session.user.id,
                        balance: {
                            gte: totalDebit,
                        },
                    },
                    data: {
                        balance: {
                            decrement: totalDebit,
                        }
                    }
                })

                if (debit.count !== 1) {
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Insufficient funds."
                    })
                }

                if (recipientAccount) {
                    await tx.account.update({
                        where: {
                            id: recipientAccount.id,
                        },
                        data: {
                            balance: {
                                increment: input.amount,
                            },
                        },
                    })
                }

                return tx.transaction.create({
                    data: {
                        type: "TRANSFER",
                        status: "COMPLETED",
                        amount: totalDebit,
                        currency: senderAccount.currency,
                        description: input.description ?? "Transfer",
                        recipientBankName: input.recipientBankName,
                        senderUserId: ctx.session.user.id,
                        senderAccountId: senderAccount.id,
                        ...(recipientAccount && {
                            receiverUserId: recipientAccount.userId,
                            receiverAccountId: recipientAccount.id,
                        }),
                    }
                })
            }
        )

        return {
            success: true,
            transactionId: transaction.id,
            message: "Transfer completed successfully."
        }
    })
    
})