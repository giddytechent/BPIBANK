"use client";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/trpc/routers";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});