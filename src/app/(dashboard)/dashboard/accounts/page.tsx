"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import { formatMoney } from "@/utils/formatMoney";
import { CreateAccountForm } from "@/components/dashboard/createAccountForm";

export default function AccountsPage() {
  const trpc = useTRPC();

  const accountsQuery = useQuery(
    trpc.account.getMyAccounts.queryOptions(),
  );

  if (accountsQuery.isLoading) {
    return (
      <div className="p-8">
        Loading accounts...
      </div>
    );
  }

  if (accountsQuery.isError) {
    return (
      <div className="p-8">
        <p className="text-red-400">
          {accountsQuery.error.message}
        </p>
      </div>
    );
  }

  const accounts = accountsQuery.data ?? [];

  return (
    <div className="p-5 sm:p-8">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Banking
        </p>

        <h1 className="mt-1 text-3xl font-semibold">
          My accounts
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your GiddyBank accounts.
        </p>
      </header>

      {accounts.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-10 text-center">
          <h2 className="text-lg font-semibold">
            No accounts yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create your first account to get started.
          </p>

          <div className="mx-auto mt-6 max-w-sm text-left">
            <CreateAccountForm />
          </div>
        </div>
        
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl border border-white/10 bg-white/3 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    {account.type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {account.accountNumber.slice(-4)}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                  Active
                </span>
              </div>

              <div className="mt-10">
                <p className="text-xs text-slate-500">
                  Available balance
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  
                  {formatMoney(account.balance)}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/dashboard/accounts/${account.id}`}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                >
                  View account
                </Link>

                <Link href="/dashboard/transfers" className="rounded-xl bg-blue-500/10 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/20">
                  Transfer
                </Link>
              </div>
            </div>
          ))}
          <CreateAccountForm />
        </div>
      )}
    </div>
  );
}