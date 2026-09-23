"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import { formatMoney } from "@/utils/formatMoney";
import { CreateAccountForm } from "@/components/dashboard/createAccountForm";
import { AccountNumber } from "@/components/dashboard/accountNumber";

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
    <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:px-10">
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          Personal banking
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
          My accounts
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your connected accounts and balances.
        </p>
      </header>

      {accounts.length === 0 ? (
        <div className="rounded-md border border-stone-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-semibold">
            No accounts yet
          </h2>

          <p className="mt-2 text-sm text-stone-500">
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
              className="rounded-md border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-900">
                    {account.type}
                  </p>

                  <AccountNumber accountNumber={account.accountNumber} />

                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Active
                </span>
              </div>

              <div className="mt-10">
                <p className="text-xs text-stone-500">
                  Available balance
                </p>

                <p className="mt-2 text-3xl font-semibold">
                  
                  {formatMoney(account.balance)}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <Link
                  href={`/dashboard/accounts/${account.id}`}
                  className="rounded-md border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  View account
                </Link>

                <Link href="/dashboard/transfers" className="rounded-md bg-(--brand-red) px-4 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark)">
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
