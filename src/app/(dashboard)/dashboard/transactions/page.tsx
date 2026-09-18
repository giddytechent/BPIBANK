"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Filter, Search } from "lucide-react";
import { useTRPC } from "@/trpc";
import { formatMoney } from "@/utils/formatMoney";

export default function TransactionPage() {
  const trpc = useTRPC();
  const accountsQuery = useQuery(trpc.account.getMyAccounts.queryOptions());
  const transactionsQuery = useQuery(trpc.account.getMyTransactions.queryOptions());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const transactions = [...(transactionsQuery.data ?? [])].sort(
    (firstTransaction, secondTransaction) =>
      new Date(secondTransaction.createdAt).getTime() -
      new Date(firstTransaction.createdAt).getTime(),
  );
  const isIncomingTransaction = (transaction: (typeof transactions)[number]) =>
    Boolean(
      transaction.receiverAccountId &&
        accountsQuery.data?.some(
          (account) => account.id === transaction.receiverAccountId,
        ),
    );
  const income = transactions
    .filter(isIncomingTransaction)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const spending = transactions
    .filter((transaction) => !isIncomingTransaction(transaction))
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const accountCount = accountsQuery.data?.length ?? 0;
  const visibleTransactions = transactions.filter((transaction) => {
    const isIncoming = isIncomingTransaction(transaction);
    const matchesFilter = activeFilter === "All"
      || (activeFilter === "Income" && isIncoming)
      || (activeFilter === "Spending" && !isIncoming)
      || (activeFilter === "Transfers" && transaction.type === "TRANSFER");
    const searchableText = [
      transaction.description,
      transaction.type,
      transaction.recipientBankName,
      transaction.senderAccount?.accountNumber,
      transaction.receiverAccount?.accountNumber,
    ].filter(Boolean).join(" ").toLowerCase();

    return matchesFilter && searchableText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-5 sm:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Payments</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Transactions</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-300 focus-within:border-blue-400/50">
            <Search className="h-4 w-4 text-slate-500" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search" className="w-24 bg-transparent text-sm text-white outline-none placeholder:text-slate-500 sm:w-32" />
          </label>

          <button type="button" onClick={() => setActiveFilter(activeFilter === "All" ? "Transfers" : "All")} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Total income" value={formatMoney(income)} tone="income" />
        <SummaryCard title="Total spending" value={formatMoney(spending)} tone="spending" />
        <SummaryCard title="Linked accounts" value={String(accountCount)} tone="neutral" />
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest account movements</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              "All",
              "Income",
              "Spending",
              "Transfers",
            ].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-3 py-1.5 ${
                  filter === activeFilter
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-slate-900 text-slate-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {transactionsQuery.isLoading && (
            <p className="py-6 text-sm text-slate-500">Loading transactions...</p>
          )}

          {transactionsQuery.isError && (
            <p className="py-6 text-sm text-red-400">{transactionsQuery.error.message}</p>
          )}

          {!transactionsQuery.isLoading &&
            !transactionsQuery.isError &&
            visibleTransactions.length === 0 && (
              <p className="py-6 text-sm text-slate-500">No transactions yet.</p>
            )}

          {visibleTransactions.map((transaction) => {
            const isIncome = isIncomingTransaction(transaction);
            const account = isIncome
              ? transaction.receiverAccount
              : transaction.senderAccount;
            const title =
              transaction.description ??
              `${transaction.type.charAt(0)}${transaction.type.slice(1).toLowerCase()}`;
            const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      isIncome ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-slate-100">{title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {transaction.type.toLowerCase()} · {date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isIncome ? "text-emerald-400" : "text-slate-100"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatMoney(transaction.amount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {account ? `${account.type.toLowerCase()} · ${account.accountNumber}` : "Account"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "income" | "spending" | "neutral";
}) {
  const toneClasses = {
    income: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
    spending: "border-red-500/20 bg-red-500/5 text-red-300",
    neutral: "border-white/10 bg-white/3 text-slate-200",
  };

  return (
    <div className={`rounded-2xl border p-5 ${toneClasses[tone]}`}>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}