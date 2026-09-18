import { TRPCError } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  publicProcedure,
  router,
} from "../init";

import { generateAccountNumber } from "../utils/accountNumber"; 

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(50),
        email: z.string().email(),
        password: z.string().min(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase().trim();

      const existingUser =
        await ctx.prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "An account with this email already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(
        input.password,
        12,
      );

      const result = await ctx.prisma.$transaction(
        async (tx) => {
          const user = await tx.user.create({
            data: {
              name: input.name,
              email,
              passwordHash,
            },
          });

          const accountNumber =
            await generateAccountNumber(
              tx as Parameters<typeof generateAccountNumber>[0],
            );

          const account = await tx.account.create({
            data: {
              accountNumber,
              type: "CHECKING",
              balance: 0,
              currency: "USD",
              userId: user.id,
            },
          });

          return {
            user,
            account,
          };
        },
      );

      return {
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
        },

        account: {
          id: result.account.id,
          accountNumber:
            result.account.accountNumber,
          type: result.account.type,
          balance: result.account.balance,
          currency: result.account.currency,
        },
      };
    }),
});