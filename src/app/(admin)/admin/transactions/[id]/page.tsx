"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import { queryClient } from "@/trpc/query-client";
import { AdminEmpty, AdminLoading, AdminMessage, AdminPageHeader, AdminPanel, StatusBadge, formatAdminMoney } from "@/components/admin/admin-ui";

export default function AdminTransactionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const trpc = useTRPC();
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"PENDING" | "COMPLETED" | "FAILED">("COMPLETED");
  const [dateTime, setDateTime] = useState("");
  const [message, setMessage] = useState("");
  const transactionQuery = useQuery(trpc.admin.getTransactions.queryOptions({ page: 1, pageSize: 10, search: id }));
  const transaction = transactionQuery.data?.items.find((item) => item.id === id);
  const auditQuery = useQuery(trpc.admin.getTransactionAudit.queryOptions({ transactionId: id }));

  useEffect(() => {
    if (!transaction) return;
    setAmount((transaction.amount / 100).toFixed(2));
    setStatus(transaction.status);
    setDateTime(toLocalInputValue(transaction.createdAt));
  }, [transaction?.id, transaction?.amount, transaction?.status, transaction?.createdAt]);

  const editTransaction = useMutation(trpc.admin.editTransaction.mutationOptions({
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries(),
        queryClient.invalidateQueries({ queryKey: trpc.admin.getTransactionAudit.queryKey({ transactionId: id }) }),
      ]);
      setMessage("Transaction saved. A before-and-after audit entry was recorded.");
    },
  }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!transaction) return;
    setMessage("");
    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
      setMessage("Enter a valid amount greater than zero.");
      return;
    }
    const revisedDate = new Date(dateTime);
    if (Number.isNaN(revisedDate.getTime())) {
      setMessage("Enter a valid transaction date and time.");
      return;
    }
    const accepted = window.confirm(
      `Save changes to this ${transaction.type.toLowerCase()}? If amount or status changes, linked account balances will be reconciled. The change will be recorded in the audit history.`,
    );
    if (!accepted) return;

    try {
      await editTransaction.mutateAsync({
        transactionId: id,
        amount: amountCents,
        status,
        dateTime: revisedDate.toISOString(),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update this transaction.");
    }
  };

  if (transactionQuery.isLoading) return <AdminLoading label="Loading transaction..." />;
  if (transactionQuery.isError) return <AdminMessage>Could not load transaction: {transactionQuery.error.message}</AdminMessage>;
  if (!transaction) return <AdminEmpty title="Transaction not found" detail="This transaction may have been removed or the identifier is incorrect." />;

  const sender = transaction.senderUser;
  const receiver = transaction.receiverUser;
  const senderAccount = transaction.senderAccount;
  const receiverAccount = transaction.receiverAccount;

  return (
    <>
      <AdminPageHeader
        eyebrow="Transaction review"
        title={transaction.type.charAt(0) + transaction.type.slice(1).toLowerCase()}
        description={`Reference ${transaction.id} · Created ${new Date(transaction.createdAt).toLocaleString()}`}
        action={<Link href="/admin/transactions" className="rounded-md border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50">Back to transactions</Link>}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <AdminPanel className="p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">Edit transaction</h2><p className="mt-1 text-sm text-stone-500">Amount is entered in dollars. The saved value uses integer cents.</p></div><StatusBadge status={transaction.status} /></div>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="transaction-amount" className="mb-1.5 block text-sm font-medium text-stone-700">Amount ({transaction.currency})</label>
              <input id="transaction-amount" type="number" min="0.01" step="0.01" required value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-(--brand-red)" />
              {transaction.type === "TRANSFER" && <p className="mt-1.5 text-xs leading-5 text-stone-500">Completed transfer amounts include the $10.00 fee in the sender debit; the recipient receives the amount less that fee.</p>}
            </div>
            <div>
              <label htmlFor="transaction-status" className="mb-1.5 block text-sm font-medium text-stone-700">Status</label>
              <select id="transaction-status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm">
                <option value="COMPLETED">Successful</option><option value="PENDING">Pending</option><option value="FAILED">Failed</option>
              </select>
              <p className="mt-1.5 text-xs leading-5 text-stone-500">Only successful transactions affect account balances. Changing status reconciles the balance changes in the same save.</p>
            </div>
            <div>
              <label htmlFor="transaction-time" className="mb-1.5 block text-sm font-medium text-stone-700">Transaction date and time</label>
              <input id="transaction-time" type="datetime-local" required value={dateTime} onChange={(event) => setDateTime(event.target.value)} className="w-full rounded-md border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-(--brand-red)" />
            </div>
            {message && <AdminMessage tone={editTransaction.isError ? "error" : "success"}>{message}</AdminMessage>}
            <button type="submit" disabled={editTransaction.isPending} className="rounded-md bg-(--brand-red) px-4 py-2.5 text-sm font-semibold text-white hover:bg-(--brand-red-dark) disabled:opacity-50">{editTransaction.isPending ? "Saving changes..." : "Save transaction"}</button>
          </form>
        </AdminPanel>

        <div className="space-y-6">
          <AdminPanel className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Linked accounts</h2>
            <div className="mt-4 grid gap-3">
              <Party label="From" user={sender} account={senderAccount} />
              <Party label="To" user={receiver} account={receiverAccount} />
            </div>
            <p className="mt-4 border-t border-stone-100 pt-4 text-sm text-stone-600">Recorded amount: <span className="font-semibold text-stone-900">{formatAdminMoney(transaction.amount, transaction.currency)}</span></p>
          </AdminPanel>

          <AdminPanel className="overflow-hidden">
            <div className="border-b border-stone-200 p-5"><h2 className="font-semibold">Change history</h2><p className="mt-1 text-sm text-stone-500">Previous and new values, the admin, and the time of each change.</p></div>
            {auditQuery.isLoading ? <div className="p-5 text-sm text-stone-500">Loading audit history...</div> : null}
            {auditQuery.isError ? <p role="alert" className="m-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">Could not load audit history: {auditQuery.error.message}</p> : null}
            {auditQuery.data?.length === 0 ? <AdminEmpty title="No edits recorded" detail="Changes made after audit tracking was enabled will appear here." /> : null}
            {auditQuery.data && auditQuery.data.length > 0 ? <ol className="divide-y divide-stone-100">
              {auditQuery.data.map((entry) => <li key={entry.id} className="p-4">
                <p className="text-sm font-semibold">{entry.actor?.name || entry.actor?.email || "Admin account removed"}</p>
                <p className="mt-1 text-xs text-stone-500">{new Date(entry.changedAt).toLocaleString()}</p>
                <p className="mt-2 text-xs text-stone-500">
                  Customer record: {sender ? <Link href={`/admin/users/${sender.id}`} className="font-semibold text-(--brand-red) hover:underline">{sender.name || sender.email}</Link> : <span>Unavailable</span>}
                  {receiver && receiver.id !== sender?.id ? <> <span className="text-stone-400">→</span> <Link href={`/admin/users/${receiver.id}`} className="font-semibold text-(--brand-red) hover:underline">{receiver.name || receiver.email}</Link></> : null}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs"><dt className="text-stone-500">Amount</dt><dd className="text-right">{formatAdminMoney(entry.previousAmount, transaction.currency)} → {formatAdminMoney(entry.newAmount, transaction.currency)}</dd><dt className="text-stone-500">Status</dt><dd className="text-right">{entry.previousStatus} → {entry.newStatus}</dd><dt className="text-stone-500">Date/time</dt><dd className="text-right">{new Date(entry.previousCreatedAt).toLocaleString()}<br />→ {new Date(entry.newCreatedAt).toLocaleString()}</dd></dl>
              </li>)}
            </ol> : null}
          </AdminPanel>
        </div>
      </div>
    </>
  );
}

function Party({ label, user, account }: { label: string; user: { id: string; name: string | null; email: string } | null; account: { id: string; accountNumber: string; type: string } | null }) {
  return <div className="rounded-md border border-stone-200 bg-stone-50 p-3"><p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p><p className="mt-1 font-medium">{user ? <Link href={`/admin/users/${user.id}`} className="text-(--brand-red) hover:underline">{user.name || user.email}</Link> : "External / unlinked"}</p><p className="mt-1 text-xs text-stone-500">{account ? `${account.type} · ${account.accountNumber}` : "No account link"}</p></div>;
}

function toLocalInputValue(value: Date | string) {
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}
