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
  formatAdminMoney,
} from "@/components/admin/admin-ui";

const PAGE_SIZE = 20;

export default function AdminUsersPage() {
  const trpc = useTRPC();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const usersQuery = useQuery(
    trpc.user.getAll.queryOptions({ page, pageSize: PAGE_SIZE, search: deferredSearch }),
  );

  return (
    <>
      <AdminPageHeader
        eyebrow="Administration"
        title="Users and accounts"
        description="Find customers, review their account totals, and open a profile to manage details or account actions."
      />

      <AdminPanel className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-stone-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Customer directory</h2>
            {usersQuery.data && <p className="mt-1 text-sm text-stone-500">{usersQuery.data.total} users</p>}
          </div>
          <label className="sr-only" htmlFor="user-search">Search users</label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Search name or email"
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-(--brand-red) sm:max-w-xs"
          />
        </div>

        {usersQuery.isLoading ? <AdminLoading label="Loading users..." /> : null}
        {usersQuery.isError ? <p role="alert" className="m-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load users: {usersQuery.error.message}</p> : null}
        {usersQuery.data && usersQuery.data.items.length === 0 ? <AdminEmpty title="No users found" detail={deferredSearch ? "Try a different name or email." : "User accounts will appear here."} /> : null}

        {usersQuery.data && usersQuery.data.items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
                  <tr><th className="px-4 py-3 font-semibold">Customer</th><th className="px-4 py-3 font-semibold">Location</th><th className="px-4 py-3 font-semibold">Accounts</th><th className="px-4 py-3 font-semibold">Balance summary</th><th className="px-4 py-3 text-right font-semibold">Details</th></tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usersQuery.data.items.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50/70">
                      <td className="px-4 py-4"><p className="font-semibold text-stone-900">{user.name || "Unnamed user"}</p><p className="mt-1 text-stone-500">{user.email}</p></td>
                      <td className="px-4 py-4 text-stone-600">{[user.city, user.country].filter(Boolean).join(", ") || "—"}</td>
                      <td className="px-4 py-4 text-stone-600">{user.accountCount}</td>
                      <td className="px-4 py-4 text-stone-700">{Object.entries(user.balances).length ? Object.entries(user.balances).map(([currency, balance]) => <span key={currency} className="mr-2 inline-block">{formatAdminMoney(balance, currency)}</span>) : "—"}</td>
                      <td className="px-4 py-4 text-right"><Link href={`/admin/users/${user.id}`} className="font-semibold text-(--brand-red) hover:underline">Manage</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination page={page} pageCount={usersQuery.data.pageCount} onPageChange={setPage} />
          </>
        ) : null}
      </AdminPanel>
    </>
  );
}
