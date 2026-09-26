import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-(--brand-red) text-sm font-bold text-white">BPI</span>
            <span>
              <span className="block text-base font-bold">BPI Bank</span>
              <span className="block text-xs text-stone-500">Administration</span>
            </span>
          </Link>
          <nav aria-label="Admin navigation" className="flex gap-2">
            <AdminNavLink href="/admin/users" label="Users" />
            <AdminNavLink href="/admin/transactions" label="Transactions" />
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/dashboard" className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-950">Customer dashboard</Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}

function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-md px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 hover:text-(--brand-red)">
      {label}
    </Link>
  );
}
