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
    <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:px-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-(--brand-red)">Payments</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">Transactions</h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 shadow-sm focus-within:border-(--brand-red)">
            <Search className="h-4 w-4 text-stone-500" />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search" className="w-24 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 sm:w-32" />
          </label>

          <button type="button" onClick={() => setActiveFilter(activeFilter === "All" ? "Transfers" : "All")} className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50">
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

      <section className="mt-8 rounded-md border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
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
                    ? "border-red-200 bg-red-50 text-(--brand-red)"
                    : "border-stone-200 bg-stone-50 text-stone-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {transactionsQuery.isLoading && (
            <p className="py-6 text-sm text-slate-500">Loading transactions...</p>
          )}

          {transactionsQuery.isError && (
            <p className="py-6 text-sm text-red-700">{transactionsQuery.error.message}</p>
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
                      isIncome ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-(--brand-red)"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-stone-900">{title}</p>
                    <p className="mt-1 text-xs text-stone-500">
                      {transaction.type.toLowerCase()} · {date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p
                      className={`text-sm font-semibold ${
                        isIncome ? "text-emerald-700" : "text-stone-900"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatMoney(transaction.amount)}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
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
    income: "border-emerald-200 bg-emerald-50 text-emerald-700",
    spending: "border-red-200 bg-red-50 text-red-700",
    neutral: "border-stone-200 bg-white text-stone-900",
  };

  return (
    <div className={`rounded-md border p-5 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-sm text-stone-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  );
}