"use client"

import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, Plus, Send, WalletCards } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc"
import { formatMoney } from "@/utils/formatMoney"

export default function DashboardPage() {
  const trpc = useTRPC()
  const accountsQuery = useQuery(trpc.account.getMyAccounts.queryOptions())
  const transactionsQuery = useQuery(trpc.account.getMyTransactions.queryOptions())
  const profileQuery = useQuery(trpc.user.me.queryOptions())

  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return <div className="p-5 text-sm text-slate-400 sm:p-8">Loading your overview...</div>
  }

  if (accountsQuery.isError || transactionsQuery.isError) {
    return (
      <div className="p-5 sm:p-8">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">
          {accountsQuery.error?.message ?? transactionsQuery.error?.message ?? "Unable to load your overview."}
        </div>
      </div>
    )
  }

  const accounts = accountsQuery.data ?? []
  const transactions = [...(transactionsQuery.data ?? [])].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  )
  const accountIds = new Set(accounts.map((account) => account.id))
  const isIncoming = (transaction: (typeof transactions)[number]) =>
    Boolean(transaction.receiverAccountId && accountIds.has(transaction.receiverAccountId))
  const income = transactions.filter(isIncoming).reduce((total, transaction) => total + transaction.amount, 0)
  const spending = transactions.filter((transaction) => !isIncoming(transaction)).reduce((total, transaction) => total + transaction.amount, 0)
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0)
  const firstAccount = accounts[0]
  const profileName = profileQuery.data?.name?.trim() || "Your profile"
  const initials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "YP"

  return (
    <div className="p-5 sm:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Your banking overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">{initials}</div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <BalanceCard title="Total balance" value={formatMoney(totalBalance)} description={`${accounts.length} linked account${accounts.length === 1 ? "" : "s"}`} primary />
        <BalanceCard title="Total income" value={formatMoney(income)} description="Across your transaction history" />
        <BalanceCard title="Total spending" value={formatMoney(spending)} description="Across your transaction history" />
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Quick actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickAction href="/dashboard/transfers" icon={<Send size={18} />} label="Send money" />
          <QuickAction href={firstAccount ? `/dashboard/accounts/${firstAccount.id}` : "/dashboard/accounts"} icon={<Plus size={18} />} label="Add money" />
          <QuickAction href="/dashboard/accounts" icon={<WalletCards size={18} />} label="View accounts" />
          <QuickAction href="/dashboard/transactions" icon={<ArrowUpRight size={18} />} label="View history" />
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">My accounts</h2>
              <p className="mt-1 text-sm text-slate-500">Balances from your connected accounts</p>
            </div>
            <Link href="/dashboard/accounts" className="text-sm text-blue-400 hover:text-blue-300">View all</Link>
          </div>

          {accounts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">No accounts yet.</div>
          ) : (
            accounts.map((account) => (
              <Link key={account.id} href={`/dashboard/accounts/${account.id}`} className="mb-3 flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-4 transition hover:border-blue-500/30 hover:bg-blue-500/5">
                <div>
                  <p className="text-sm font-medium">{account.type}</p>
                  <p className="mt-1 text-xs text-slate-500">Account ending {account.accountNumber.slice(-4)}</p>
                </div>
                <p className="text-sm font-semibold">{formatMoney(account.balance)}</p>
              </Link>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Balance</h2>
              <p className="mt-1 text-sm text-slate-500">Live totals from your accounts</p>
            </div>
            <WalletCards className="text-blue-400" size={20} />
          </div>
          <div className="space-y-5">
            <SnapshotRow label="Available balance" value={formatMoney(totalBalance)} />
            <SnapshotRow label="Incoming activity" value={formatMoney(income)} positive />
            <SnapshotRow label="Outgoing activity" value={formatMoney(spending)} />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent transactions</h2>
            <p className="mt-1 text-sm text-slate-500">Your latest account activity</p>
          </div>
          <Link href="/dashboard/transactions" className="text-sm text-blue-400 hover:text-blue-300">View all</Link>
        </div>

        {transactions.length === 0 ? (
          <p className="py-6 text-sm text-slate-500">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.slice(0, 5).map((transaction) => {
              const incoming = isIncoming(transaction)
              const title = transaction.description ?? `${transaction.type.charAt(0)}${transaction.type.slice(1).toLowerCase()}`
              const account = incoming ? transaction.receiverAccount : transaction.senderAccount

              return (
                <div key={transaction.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${incoming ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-300"}`}>
                      {incoming ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs text-slate-500">{new Date(transaction.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {account?.accountNumber ?? "External transfer"}</p>
                    </div>
                  </div>
                  <p className={`shrink-0 text-sm font-semibold ${incoming ? "text-emerald-400" : "text-slate-200"}`}>{incoming ? "+" : "-"}{formatMoney(transaction.amount)}</p>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function BalanceCard({ title, value, description, primary = false }: { title: string; value: string; description: string; primary?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 ${primary ? "border-blue-500/20 bg-blue-500/10" : "border-white/10 bg-white/3"}`}>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{description}</p>
    </div>
  )
}

function QuickAction({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 bg-white/3 p-4 text-left transition hover:border-blue-500/30 hover:bg-blue-500/5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </Link>
  )
}

function SnapshotRow({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4 text-sm last:border-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className={positive ? "text-emerald-400" : "text-slate-200"}>{value}</span>
    </div>
  )
}
