import { initTRPC, TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const createTRPCContext = async () => {
  const session = await auth();

  return {
    prisma,
    session,
  };
};

type TRPCContext = Awaited<
  ReturnType<typeof createTRPCContext>
>;

const t = initTRPC
  .context<TRPCContext>()
  .create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in",
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  },
);