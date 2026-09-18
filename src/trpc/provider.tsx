"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client";
import { TRPCProvider as TRPCContextProvider } from "./index";
import { trpcClient } from "./client";

export function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCContextProvider
        trpcClient={trpcClient}
        queryClient={queryClient}
      >
        {children}
      </TRPCContextProvider>
    </QueryClientProvider>
  );
}