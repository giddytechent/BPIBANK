"use client"

import Link from "next/link"
import { ArrowUpRight, Plus, Send, WalletCards } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import {
  AccountList,
  BalanceSummary,
  DashboardHeader,
  FeatureBanner,
  QuickAction,
  TransactionList,
  type DashboardAccount,
  type DashboardTransaction,
} from "@/components/dashboard/dashboardComponent"
import { useTRPC } from "@/trpc"
import { formatMoney } from "@/utils/formatMoney"

export default function DashboardPage() {
  const trpc = useTRPC()
  const accountsQuery = useQuery(trpc.account.getMyAccounts.queryOptions())
  const transactionsQuery = useQuery(trpc.account.getMyTransactions.queryOptions())
  const profileQuery = useQuery(trpc.user.me.queryOptions())

  if (accountsQuery.isLoading || transactionsQuery.isLoading) {
    return <div className="p-5 text-sm text-stone-500 sm:p-8">Loading your overview...</div>
  }

  if (accountsQuery.isError || transactionsQuery.isError) {
    return <div className="p-5 sm:p-8"><div className="rounded-md border border-red-200 bg-red-50 p-6 text-sm text-red-700">{accountsQuery.error?.message ?? transactionsQuery.error?.message ?? "Unable to load your overview."}</div></div>
  }

  const accounts = (accountsQuery.data ?? []) as DashboardAccount[]
  const transactions = [...(transactionsQuery.data ?? [])].sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  ) as DashboardTransaction[]
  const accountIds = new Set(accounts.map((account) => account.id))
  const isIncoming = (transaction: DashboardTransaction) => Boolean(transaction.receiverAccountId && accountIds.has(transaction.receiverAccountId))
  const income = transactions.filter(isIncoming).reduce((total, transaction) => total + transaction.amount, 0)
  const spending = transactions.filter((transaction) => !isIncoming(transaction)).reduce((total, transaction) => total + transaction.amount, 0)
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0)
  const firstAccount = accounts[0]
  const profileName = profileQuery.data?.name?.trim() || "Your profile"
  const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "YP"
  const currentDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date())

  return (
    <div className="w-full mx-auto max-w-7xl p-5 sm:p-8 lg:px-10">
      <DashboardHeader profileName={profileName} initials={initials} currentDate={currentDate} />
      <BalanceSummary totalBalance={formatMoney(totalBalance)} accountCount={accounts.length} income={formatMoney(income)} spending={formatMoney(spending)} />
      <FeatureBanner />

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
        <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">My accounts</h2><p className="mt-1 text-sm text-stone-500">Balances from your connected accounts</p></div><Link href="/dashboard/accounts" className="text-sm font-semibold text-(--brand-red) hover:text-(--brand-red-dark)">View all</Link></div>
          <AccountList accounts={accounts} />
        </div>

        <div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Account summary</h2><p className="mt-1 text-sm text-stone-500">Live totals from your accounts</p></div><WalletCards className="text-(--brand-red)" size={20} /></div>
          <div className="space-y-5">
            <SummaryRow label="Available balance" value={formatMoney(totalBalance)} />
            <SummaryRow label="Incoming activity" value={formatMoney(income)} positive />
            <SummaryRow label="Outgoing activity" value={formatMoney(spending)} />
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-md border border-stone-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between"><div><h2 className="font-semibold">Recent transactions</h2><p className="mt-1 text-sm text-stone-500">Your latest account activity</p></div><Link href="/dashboard/transactions" className="text-sm font-semibold text-(--brand-red) hover:text-(--brand-red-dark)">View all</Link></div>
        <TransactionList transactions={transactions} isIncoming={isIncoming} />
      </section>
    </div>
  )
}

function SummaryRow({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) {
  return <div className="flex items-center justify-between border-b border-stone-100 pb-4 text-sm last:border-0 last:pb-0"><span className="text-stone-500">{label}</span><span className={positive ? "font-semibold text-emerald-700" : "font-semibold text-stone-900"}>{value}</span></div>
}
