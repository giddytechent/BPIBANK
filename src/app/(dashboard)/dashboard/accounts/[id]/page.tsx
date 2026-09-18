"use client";

import Link from "next/link";
import { ArrowLeft, ArrowDownLeft, ArrowUpRight, Landmark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { useTRPC } from "@/trpc";
import { formatMoney } from "@/utils/formatMoney";
import { AddMoneyForm } from "@/components/dashboard/addMoneyForm";

export default function AccountDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trpc = useTRPC();

  const accountQuery = useQuery(
    trpc.account.getById.queryOptions({ id }),
  );
  const transactionsQuery = useQuery(
    trpc.account.getTransactions.queryOptions({ accountId: id }),
  );

  if (accountQuery.isLoading) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-10 text-center text-slate-300">
          Loading account details...
        </div>
      </div>
    );
  }

  if (accountQuery.isError) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <p className="text-lg font-semibold text-red-400">Account unavailable</p>
          <p className="mt-2 text-sm text-slate-400">{accountQuery.error.message}</p>
        </div>
      </div>
    );
  }

  const account = accountQuery.data;

  if (!account) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-10 text-center text-slate-300">
          Account not found.
        </div>
      </div>
    );
  }

  const accountTypeLabel =
    account.type === "CHECKING" ? "Checking account" : "Savings account";

  return (
    <div className="p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/dashboard/accounts"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to accounts
        </Link>

        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Active
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Account overview</p>
            <h1 className="mt-2 text-3xl font-semibold">{accountTypeLabel}</h1>
          </div>

          <div className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Account number
            </p>
            <p className="mt-1 text-sm font-medium text-slate-200">
              {account.accountNumber}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Available balance</p>
            <p className="mt-3 text-3xl font-semibold">{formatMoney(account.balance)}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Currency</p>
            <p className="mt-3 text-2xl font-semibold">{account.currency}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Created</p>
            <p className="mt-3 text-lg font-semibold">
              {new Date(account.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Landmark className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">Account activity</h2>
                <p className="text-sm text-slate-500">Recent account summary</p>
              </div>
            </div>

            <div className="space-y-4">
              {transactionsQuery.isLoading && (
                <p className="text-sm text-slate-500">Loading transactions...</p>
              )}

              {transactionsQuery.isError && (
                <p className="text-sm text-red-400">
                  {transactionsQuery.error.message}
                </p>
              )}

              {!transactionsQuery.isLoading &&
                !transactionsQuery.isError &&
                transactionsQuery.data?.length === 0 && (
                  <p className="text-sm text-slate-500">No transactions yet.</p>
                )}

              {transactionsQuery.data?.map((transaction) => {
                const isIncoming = transaction.receiverAccountId === account.id;
                const transactionLabel =
                  transaction.description ??
                  `${transaction.type.charAt(0)}${transaction.type.slice(1).toLowerCase()}`;

                return (
                  <ActivityRow
                    key={transaction.id}
                    icon={
                      isIncoming ? (
                        <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-slate-300" />
                      )
                    }
                    label={transactionLabel}
                    detail={`${transaction.status.toLowerCase()} · ${new Date(
                      transaction.createdAt,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`}
                    value={`${isIncoming ? "+" : "-"}${formatMoney(transaction.amount)}`}
                    positive={isIncoming}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Quick actions</p>

            <div className="mt-4 space-y-3">
              <Link href="/dashboard/transfers" className="block w-full rounded-xl bg-blue-500 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-400">
                Transfer money
              </Link>

              <button className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5">
                View statements
              </button>

              <div className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3 text-sm font-medium text-slate-200">
                <AddMoneyForm accountId={account.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  icon,
  label,
  detail,
  value,
  positive = false,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-black/20 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          <p className="text-xs text-slate-500">{detail}</p>
        </div>
      </div>

      <p className={`text-sm font-medium ${positive ? "text-emerald-400" : "text-slate-200"}`}>
        {value}
      </p>
    </div>
  );
}