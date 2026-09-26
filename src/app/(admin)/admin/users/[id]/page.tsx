"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc";
import { queryClient } from "@/trpc/query-client";
import {
  AdminEmpty,
  AdminLoading,
  AdminMessage,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  StatusBadge,
  formatAdminMoney,
} from "@/components/admin/admin-ui";

export default function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trpc = useTRPC();
  const router = useRouter();
  const userQuery = useQuery(trpc.user.getById.queryOptions({ id }));
  const [transactionPage, setTransactionPage] = useState(1);
  const userTransactionsQuery = useQuery(trpc.admin.getTransactions.queryOptions({
    page: transactionPage,
    pageSize: 10,
    search: "",
    userId: id,
  }));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  useEffect(() => {
    if (!userQuery.data) return;
    setName(userQuery.data.name ?? "");
    setEmail(userQuery.data.email);
    setCity(userQuery.data.city ?? "");
    setCountry(userQuery.data.country ?? "");
  }, [userQuery.data]);

  const updateProfile = useMutation(trpc.admin.updateUserProfile.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: trpc.user.getById.queryKey({ id }) }),
        queryClient.invalidateQueries(),
      ]);
    },
  }));
  const deleteUser = useMutation(trpc.admin.deleteUser.mutationOptions({
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      router.push("/admin/users");
    },
  }));

  const submitProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage("");
    try {
      await updateProfile.mutateAsync({
        userId: id,
        name: name.trim() || null,
        email,
        city: city.trim() || null,
        country: country.trim() || null,
      });
      setProfileMessage("Customer profile saved.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Could not save the profile.");
    }
  };

  if (userQuery.isLoading) return <AdminLoading label="Loading customer..." />;
  if (userQuery.isError) return <AdminMessage>Could not load customer: {userQuery.error.message}</AdminMessage>;
  if (!userQuery.data) return <AdminEmpty title="Customer not found" detail="This customer may have been removed." />;

  const user = userQuery.data;
  const hasNonzeroBalance = user.accounts.some((account) => account.balance !== 0);

  return (
    <>
      <AdminPageHeader
        eyebrow="Customer profile"
        title={user.name || "Unnamed customer"}
        description={`${user.email} · Joined ${new Date(user.createdAt).toLocaleDateString()}`}
        action={<Link href="/admin/users" className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Back to users</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="mb-5"><h2 className="text-lg font-semibold">Profile information</h2><p className="mt-1 text-sm text-stone-500">Update the customer contact details.</p></div>
          <form onSubmit={submitProfile} className="space-y-4">
            <Field label="Full name" value={name} onChange={setName} />
            <Field label="Email address" type="email" value={email} onChange={setEmail} required />
            <div className="grid gap-4 sm:grid-cols-2"><Field label="City" value={city} onChange={setCity} /><Field label="Country" value={country} onChange={setCountry} /></div>
            {profileMessage && <AdminMessage tone={updateProfile.isError ? "error" : "success"}>{profileMessage}</AdminMessage>}
            <button type="submit" disabled={updateProfile.isPending} className="rounded-md bg-(--brand-red) px-4 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-50">{updateProfile.isPending ? "Saving..." : "Save profile"}</button>
          </form>
        </AdminPanel>

        <AdminPanel className="p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Account summary</h2>
          <p className="mt-1 text-sm text-stone-500">{user.accounts.length} {user.accounts.length === 1 ? "account" : "accounts"} linked to this customer.</p>
          <div className="mt-5 space-y-3">
            {user.accounts.length === 0 ? <AdminEmpty title="No accounts" detail="This customer has no bank accounts." /> : user.accounts.map((account) => (
              <div key={account.id} className="rounded-md border border-stone-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="font-semibold">{account.type} account</p><p className="mt-1 text-sm text-stone-500">•••• {account.accountNumber.slice(-4)} · {account.accountNumber}</p></div>
                  <p className="text-right"><span className="block text-xs text-stone-500">Balance</span><span className="mt-1 block font-semibold">{formatAdminMoney(account.balance, account.currency)}</span></p>
                </div>
                <AccountActions accountId={account.id} accountNumber={account.accountNumber} balance={account.balance} userId={id} />
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel className="mt-6 overflow-hidden">
        <div className="border-b border-stone-200 p-5 sm:px-6">
          <h2 className="text-lg font-semibold">Customer transaction history</h2>
          <p className="mt-1 text-sm text-stone-500">Transactions where this customer is the sender or recipient. Open any row to edit it and review its audit trail.</p>
        </div>
        {userTransactionsQuery.isLoading ? <AdminLoading label="Loading customer transactions..." /> : null}
        {userTransactionsQuery.isError ? <p role="alert" className="m-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">Could not load this customer’s transactions: {userTransactionsQuery.error.message}</p> : null}
        {userTransactionsQuery.data?.items.length === 0 ? <AdminEmpty title="No transactions" detail="This customer has no linked transaction history." /> : null}
        {userTransactionsQuery.data && userTransactionsQuery.data.items.length > 0 ? <>
          <div className="divide-y divide-stone-100">
            {userTransactionsQuery.data.items.map((transaction) => {
              const isRecipient = transaction.receiverUser?.id === id;
              const account = isRecipient ? transaction.receiverAccount : transaction.senderAccount;
              return <div key={transaction.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{transaction.type}</span><StatusBadge status={transaction.status} /><span className="text-xs text-stone-500">{isRecipient ? "Received" : "Sent"}</span></div>
                  <p className="mt-1 truncate text-sm text-stone-600">{transaction.description || transaction.id}</p>
                  <p className="mt-1 text-xs text-stone-500">{new Date(transaction.createdAt).toLocaleString()}{account ? ` · ${account.type} •••• ${account.accountNumber.slice(-4)}` : " · Account link unavailable"}</p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end"><span className="font-semibold">{formatAdminMoney(transaction.amount, transaction.currency)}</span><Link href={`/admin/transactions/${transaction.id}`} className="font-semibold text-(--brand-red) hover:underline">Edit</Link></div>
              </div>;
            })}
          </div>
          <AdminPagination page={transactionPage} pageCount={userTransactionsQuery.data.pageCount} onPageChange={setTransactionPage} />
        </> : null}
      </AdminPanel>

      <AdminPanel className="mt-6 flex flex-col gap-4 border-red-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div><h2 className="font-semibold text-red-900">Delete customer</h2><p className="mt-1 max-w-2xl text-sm leading-5 text-stone-600">This removes the customer and their cards and accounts. All account balances must be zero. Transaction records remain, with links to this customer and their accounts cleared.</p></div>
        <button
          type="button"
          disabled={user.role === "ADMIN" || hasNonzeroBalance || deleteUser.isPending}
          onClick={() => {
            const accepted = window.confirm(`Delete ${user.name || user.email}? This permanently removes ${user.accounts.length} account(s) and their cards. Transaction history is retained with customer/account references removed. This is available only when all balances are zero.`);
            if (accepted) deleteUser.mutate({ userId: id });
          }}
          className="shrink-0 rounded-md border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        >{deleteUser.isPending ? "Deleting..." : "Delete customer"}</button>
        {deleteUser.isError && <p role="alert" className="text-sm text-red-700">{deleteUser.error.message}</p>}
        {user.role === "ADMIN" && <p className="text-sm text-stone-500">Admin users cannot be deleted here.</p>}
        {hasNonzeroBalance && <p className="text-sm text-stone-500">Move all account balances to zero before deletion.</p>}
      </AdminPanel>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  const id = `admin-field-${label.toLowerCase().replaceAll(" ", "-")}`;
  return <div><label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">{label}</label><input id={id} type={type} required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-(--brand-red)" /></div>;
}

function AccountActions({ accountId, accountNumber, balance, userId }: { accountId: string; accountNumber: string; balance: number; userId: string }) {
  const trpc = useTRPC();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const deposit = useMutation(trpc.admin.deposit.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: trpc.user.getById.queryKey({ id: userId }) }),
        queryClient.invalidateQueries(),
      ]);
    },
  }));
  const deleteAccount = useMutation(trpc.admin.deleteAccount.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: trpc.user.getById.queryKey({ id: userId }) }),
        queryClient.invalidateQueries(),
      ]);
    },
  }));

  const submitDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents <= 0) return;
    if (!window.confirm(`Add $${(cents / 100).toFixed(2)} to account ${accountNumber}? The balance and a completed deposit transaction will both be recorded.`)) return;
    try {
      await deposit.mutateAsync({ accountId, amount: cents });
      setAmount("");
      setMessage("Deposit recorded and account balance updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add money.");
    }
  };

  const confirmDelete = () => {
    if (!window.confirm(`Delete account ${accountNumber}? This action is available only at a zero balance. Transaction rows will remain, but their links to this account will be cleared.`)) return;
    deleteAccount.mutate({ accountId });
  };

  return (
    <div className="mt-4 border-t border-stone-100 pt-4">
      <form onSubmit={submitDeposit} className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`deposit-${accountId}`}>Deposit amount in dollars</label>
        <div className="flex min-w-0 flex-1"><span className="inline-flex items-center rounded-l-md border border-r-0 border-stone-300 bg-stone-50 px-3 text-sm text-stone-500">$</span><input id={`deposit-${accountId}`} required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Amount" className="min-w-0 flex-1 rounded-r-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-(--brand-red)" /></div>
        <button type="submit" disabled={deposit.isPending || !amount} className="rounded-md bg-(--brand-red) px-3 py-2 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-50">{deposit.isPending ? "Adding..." : "Add money"}</button>
        <button type="button" disabled={balance !== 0 || deleteAccount.isPending} onClick={confirmDelete} className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">{deleteAccount.isPending ? "Deleting..." : "Delete account"}</button>
      </form>
      {(message || deposit.isError || deleteAccount.isError) && <p role={deposit.isError || deleteAccount.isError || (message && !message.startsWith("Deposit recorded")) ? "alert" : "status"} className={`mt-2 text-sm ${deposit.isError || deleteAccount.isError || (message && !message.startsWith("Deposit recorded")) ? "text-red-700" : "text-emerald-700"}`}>{message || deposit.error?.message || deleteAccount.error?.message}</p>}
      {balance !== 0 && <p className="mt-2 text-xs text-stone-500">An account must have a zero balance before deletion.</p>}
    </div>
  );
}
