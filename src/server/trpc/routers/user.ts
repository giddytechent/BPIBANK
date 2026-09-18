import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  protectedProcedure,
  publicProcedure,
  router,
} from "../init";

export const userRouter = router({
  getById: publicProcedure
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
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
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