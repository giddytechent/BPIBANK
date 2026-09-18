
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const trpc = useTRPC();
    const profileQuery = useQuery(trpc.user.me.queryOptions());
    const profileName = profileQuery.data?.name?.trim() || "Your profile";
    const profileInitials = profileName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "YP";

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="hidden w-64 border-r border-white/10 bg-slate-950 lg:block">
                    <div className="flex h-full flex-col px-5 py-6">
                        {/* Logo */}
                        <Link href="/dashboard" className="mb-10 flex items-center gap-2 justify-center">
                            <Image
                                src="/BPI1.png"
                                alt="BPI logo"
                                width="50"
                                height="50"
                                className="border rounded-xl"
                            />
                            <div className="text-xl font-bold tracking-tight">
                                BPI <span className="text-blue-400">Bank</span>
                            </div>
                        </Link>

                        {/* Navigation */}
                        <nav className="space-y-1">
                            <NavItem href="/dashboard" label="Overview" pathname={pathname} />
                            <NavItem href="/dashboard/accounts" label="Accounts" pathname={pathname} />
                            <NavItem href="/dashboard/transfers" label="Transfers" pathname={pathname} />
                            <NavItem href="/dashboard/transactions" label="Transactions" pathname={pathname} />
                            <NavItem href="/dashboard/cards" label="Cards" pathname={pathname} />
                        </nav>

                        <div className="mt-auto">
                            <nav className="space-y-1">
                                <NavItem href="/dashboard/settings" label="Settings" pathname={pathname} />
                            </nav>

                            <div className="mt-6 border-t border-white/10 pt-5">
                                <div className="flex items-center gap-3 px-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-300">
                                        {profileInitials}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium">{profileName}</p>
                                        <p className="text-xs text-slate-500">Personal account</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <main className="min-w-0 flex-1">
                    <div className="flex items-center border-b border-white/10 px-5 py-3 lg:hidden">
                        <button
                            type="button"
                            onClick={() => pathname === "/dashboard" ? router.push("/") : router.back()}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    );
}

function NavItem({
    href,
    label,
    pathname,
}: {
    href: string;
    label: string;
    pathname: string;
}) {
    const isActive = href === "/dashboard"
        ? pathname === href || pathname === `${href}/`
        : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            className={`block w-full rounded-xl px-3 py-2.5 text-sm transition ${isActive
                ? "bg-blue-500/10 text-blue-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
        >
            {label}
        </Link>
    );
}