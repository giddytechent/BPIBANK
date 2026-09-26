import type { ReactNode } from "react";

export function formatAdminMoney(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);
  } catch {
    return `${currency} ${(amount / 100).toFixed(2)}`;
  }
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-(--brand-red)">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-md border border-stone-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

export function AdminMessage({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success" | "info";
}) {
  const tones = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-amber-200 bg-amber-50 text-amber-900",
  };
  return <p role={tone === "error" ? "alert" : "status"} className={`rounded-md border px-4 py-3 text-sm ${tones[tone]}`}>{children}</p>;
}

export function AdminPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3">
      <p className="text-sm text-stone-500">Page {page} of {Math.max(pageCount, 1)}</p>
      <div className="flex gap-2">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} className="rounded-md border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

export function AdminLoading({ label = "Loading records..." }: { label?: string }) {
  return <AdminPanel className="p-8 text-center text-sm text-stone-500">{label}</AdminPanel>;
}

export function AdminEmpty({ title, detail }: { title: string; detail: string }) {
  return <div className="px-6 py-14 text-center"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-stone-500">{detail}</p></div>;
}

export function StatusBadge({ status }: { status: "PENDING" | "COMPLETED" | "FAILED" }) {
  const style = status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : status === "PENDING" ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800";
  const label = status === "COMPLETED" ? "Successful" : status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}
