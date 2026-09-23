import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CalendarDays, CheckCircle2, ChevronRight, CircleX, Clock3, Send, TrendingDown, TrendingUp, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import { formatMoney } from "@/utils/formatMoney";

export type DashboardAccount = {
  id: string;
  type: string;
  accountNumber: string;
  balance: number;
};

export type DashboardTransaction = {
  id: string;
  type: string;
  status: string;
  amount: number;
  description: string | null;
  createdAt: Date | string;
  receiverAccountId?: string | null;
  senderAccount?: { accountNumber: string } | null;
  receiverAccount?: { accountNumber: string } | null;
};

export function DashboardHeader({ profileName, initials, currentDate }: { profileName: string; initials: string; currentDate: string }) {
  return <header className="mb-10 flex flex-wrap items-end justify-between gap-5"><div className="flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--brand-gold) text-lg font-bold text-(--brand-red-dark) ring-4 ring-white">{initials}</div><div><p className="text-sm font-semibold uppercase tracking-widest text-(--brand-red)">Personal banking</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">Welcome back, {profileName.split(" ")[0]}</h1><p className="mt-2 flex items-center gap-2 text-sm text-stone-500"><CalendarDays size={15} />{currentDate}</p></div></div><Link href="/dashboard/transfers" className="rounded-md bg-(--brand-red) px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-(--brand-red-dark)">Transfer money</Link></header>;
}

export function BalanceSummary({ totalBalance, accountCount, income, spending }: { totalBalance: string; accountCount: number; income: string; spending: string }) {
  return <section className="grid gap-5 md:grid-cols-[1.35fr_0.65fr]"><div className="brand-pattern rounded-md border border-transparent p-7 text-white shadow-md sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-widest text-white/70">Total balance</p><p className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{totalBalance}</p><p className="mt-3 text-sm text-white/70">Available across {accountCount} linked account{accountCount === 1 ? "" : "s"}</p></div><WalletCards className="text-(--brand-gold)" size={26} /></div><div className="mt-10 flex flex-wrap items-center gap-4 border-t border-white/20 pt-5"><Link href="/dashboard/accounts" className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-(--brand-gold)">View accounts <ArrowRight size={16} /></Link><span className="text-xs text-white/60">Updated just now</span></div></div><div className="rounded-md border border-stone-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-widest text-stone-500">This period</p><div className="mt-5 space-y-5"><MetricRow label="Money in" value={income} icon={<TrendingUp size={17} />} positive /><MetricRow label="Money out" value={spending} icon={<TrendingDown size={17} />} /></div></div></section>;
}

export function FeatureBanner() {
  return <section className="relative mt-8 overflow-hidden rounded-md bg-(--brand-red) text-white shadow-md"><div className="absolute inset-y-0 right-0 hidden w-2/5 bg-(--brand-red-dark) sm:block [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]" /><div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"><div className="flex items-center gap-4"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-sm"><img src="/BPI1.png" alt="BPI" className="h-full w-full object-contain" /></div><div><p className="text-sm font-semibold uppercase tracking-widest text-(--brand-gold)">Your money, your momentum</p><h2 className="mt-1 text-xl font-bold sm:text-2xl">Keep your accounts working for you.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Review your balances and move money between your accounts whenever you need to.</p></div></div><Link href="/dashboard/accounts" className="relative inline-flex shrink-0 items-center justify-center rounded-md bg-(--brand-gold) px-5 py-3 text-sm font-bold text-(--brand-red-dark) transition hover:bg-white">View accounts</Link></div></section>;
}

export function AccountList({ accounts }: { accounts: DashboardAccount[] }) {
  return accounts.length === 0 ? <div className="rounded-md border border-dashed border-stone-300 p-6 text-center text-sm text-stone-500">No accounts yet.</div> : <div className="overflow-x-auto"><div className="min-w-120 divide-y divide-stone-100">{accounts.map((account) => <Link key={account.id} href={`/dashboard/accounts/${account.id}`} className="group flex min-h-14 items-center gap-4 py-4 first:pt-0 last:pb-0"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-xs font-bold text-(--brand-red)">{account.type.slice(0, 2)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-stone-900">{account.type.charAt(0) + account.type.slice(1).toLowerCase()} account</p><p className="mt-1 text-xs text-stone-500">•••• {account.accountNumber.slice(-4)}</p></div><div className="hidden text-right sm:block"><p className="text-xs text-stone-500">Status</p><p className="mt-1 flex items-center justify-end gap-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} /> Active</p></div><p className="text-sm font-bold text-stone-900">{formatMoney(account.balance)}</p><ChevronRight size={18} className="shrink-0 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-(--brand-red)" /></Link>)}</div></div>;
}

export function TransactionList({ transactions, isIncoming }: { transactions: DashboardTransaction[]; isIncoming: (transaction: DashboardTransaction) => boolean }) {
  if (transactions.length === 0) return <p className="py-6 text-sm text-stone-500">No transactions yet.</p>;
  return <div className="divide-y divide-stone-100">{transactions.slice(0, 5).map((transaction) => { const incoming = isIncoming(transaction); const account = incoming ? transaction.receiverAccount : transaction.senderAccount; const date = new Date(transaction.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); const time = new Date(transaction.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }); const title = transaction.description ?? `${transaction.type.charAt(0)}${transaction.type.slice(1).toLowerCase()}`; return <div key={transaction.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${incoming ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-(--brand-red)"}`}>{transaction.type === "TRANSFER" ? <Send size={17} /> : incoming ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="mt-1 text-xs text-stone-500">{transaction.type.toLowerCase()} · {date} at {time} · {account?.accountNumber ? `•••• ${account.accountNumber.slice(-4)}` : "External transfer"}</p></div></div><div className="flex items-center justify-between gap-4 pl-13 sm:justify-end sm:pl-0"><p className={`shrink-0 text-sm font-semibold ${incoming ? "text-emerald-700" : "text-stone-900"}`}>{incoming ? "+" : "-"}{formatMoney(transaction.amount)}</p><StatusBadge status={transaction.status} /></div></div>; })}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const config = { COMPLETED: { label: "Completed", className: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={13} /> }, PENDING: { label: "Pending", className: "bg-amber-100 text-amber-700", icon: <Clock3 size={13} /> }, FAILED: { label: "Failed", className: "bg-red-100 text-red-700", icon: <CircleX size={13} /> } }[status] ?? { label: "Unknown", className: "bg-stone-100 text-stone-600", icon: null };
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}>{config.icon}{config.label}</span>;
}

export function QuickAction({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return <Link href={href} className="group rounded-md border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:border-red-300 hover:bg-red-50"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-(--brand-red)">{icon}</div><p className="text-sm font-medium">{label}</p></Link>;
}

function MetricRow({ label, value, icon, positive = false }: { label: string; value: string; icon: ReactNode; positive?: boolean }) {
  return <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4 last:border-0 last:pb-0"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${positive ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-(--brand-red)"}`}>{icon}</span><span className="text-sm text-stone-500">{label}</span></div><span className="text-base font-bold text-stone-900">{value}</span></div>;
}
