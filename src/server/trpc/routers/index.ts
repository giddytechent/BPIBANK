import { router } from "../init";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { accountRouter } from "./account";


export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    account: accountRouter
})

export type AppRouter = typeof appRouter