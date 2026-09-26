import { router } from "../init";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { accountRouter } from "./account";
import { adminRouter } from "./admin";


export const appRouter = router({
    auth: authRouter,
    user: userRouter,
    account: accountRouter,
    admin: adminRouter,
})

export type AppRouter = typeof appRouter
