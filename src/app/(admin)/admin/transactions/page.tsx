"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import {
  AdminEmpty,
  AdminLoading,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  StatusBadge,
  formatAdminMoney,
} from "@/components/admin/admin-ui";

const PAGE_SIZE = 20;

export default function AdminTransactionsPage() {
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [type, setType] = useState("ALL");
  const deferredSearch = useDeferredValue(search.trim());
  const transactionsQuery = useQuery(trpc.admin.getTransactions.queryOptions({
    page,
    pageSize: PAGE_SIZE,
    search: deferredSearch,
    ...(status !== "ALL" ? { status: status as "PENDING" | "COMPLETED" | "FAILED" } : {}),
    ...(type !== "ALL" ? { type: type as "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" } : {}),
  }));

  return (
    <>
      <AdminPageHeader
        eyebrow="Administration"
        title="Transactions"
        description="Search transaction history, filter by state or type, and open a record to edit it with a full balance reconciliation and audit trail."
      />
      <AdminPanel className="overflow-hidden">
        <div className="grid gap-3 border-b border-stone-200 p-4 sm:grid-cols-[minmax(220px,1fr)_180px_180px]">
          <div><label className="sr-only" htmlFor="transaction-search">Search transactions</label><input id="transaction-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search ID, customer, account" className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-(--brand-red)" /></div>
          <div><label className="sr-only" htmlFor="transaction-status">Filter by status</label><select id="transaction-status" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm"><option value="ALL">All statuses</option><option value="COMPLETED">Successful</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option></select></div>
          <div><label className="sr-only" htmlFor="transaction-type">Filter by type</label><select id="transaction-type" value={type} onChange={(event) => { setType(event.target.value); setPage(1); }} className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm"><option value="ALL">All types</option><option value="DEPOSIT">Deposit</option><option value="WITHDRAWAL">Withdrawal</option><option value="TRANSFER">Transfer</option></select></div>
        </div>
        {transactionsQuery.isLoading ? <AdminLoading label="Loading transactions..." /> : null}
        {transactionsQuery.isError ? <p role="alert" className="m-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load transactions: {transactionsQuery.error.message}</p> : null}
        {transactionsQuery.data && transactionsQuery.data.items.length === 0 ? <AdminEmpty title="No transactions found" detail={deferredSearch || status !== "ALL" || type !== "ALL" ? "Try changing your search or filters." : "Transaction activity will appear here."} /> : null}
        {transactionsQuery.data && transactionsQuery.data.items.length > 0 ? <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500"><tr><th className="px-4 py-3 font-semibold">Transaction</th><th className="px-4 py-3 font-semibold">Customer / account</th><th className="px-4 py-3 font-semibold">Date and time</th><th className="px-4 py-3 font-semibold">Amount</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Action</th></tr></thead>
              <tbody className="divide-y divide-stone-100">
                {transactionsQuery.data.items.map((transaction) => {
                  const person = transaction.receiverUser ?? transaction.senderUser;
                  const account = transaction.receiverAccount ?? transaction.senderAccount;
                  return <tr key={transaction.id} className="hover:bg-stone-50/70">
                    <td className="px-4 py-4"><p className="font-semibold">{transaction.type}</p><p className="mt-1 max-w-56 truncate text-xs text-stone-500">{transaction.description || transaction.id}</p></td>
                    <td className="px-4 py-4"><p className="font-medium">{person ? <Link href={`/admin/users/${person.id}`} className="text-(--brand-red) hover:underline">{person.name || person.email}</Link> : "External / unlinked"}</p><p className="mt-1 text-xs text-stone-500">{account ? `${account.type} · •••• ${account.accountNumber.slice(-4)}` : "Account link unavailable"}</p></td>
                    <td className="px-4 py-4 text-stone-600">{new Date(transaction.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4 font-semibold">{formatAdminMoney(transaction.amount, transaction.currency)}</td>
                    <td className="px-4 py-4"><StatusBadge status={transaction.status} /></td>
                    <td className="px-4 py-4 text-right"><Link href={`/admin/transactions/${transaction.id}`} className="font-semibold text-(--brand-red) hover:underline">Review</Link></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
          <AdminPagination page={page} pageCount={transactionsQuery.data.pageCount} onPageChange={setPage} />
        </> : null}
      </AdminPanel>
    </>
  );
}
