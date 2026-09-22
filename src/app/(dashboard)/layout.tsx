
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";

export default function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
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

    const navItems = [
        ["/dashboard", "Overview"],
        ["/dashboard/accounts", "Accounts"],
        ["/dashboard/transfers", "Transfers"],
        ["/dashboard/transactions", "Transactions"],
        ["/dashboard/cards", "Cards"],
    ] as const;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="brand-pattern sticky top-0 z-20 text-white shadow-md">
                <div className="mx-auto flex min-h-18 max-w-7xl items-center gap-5 px-5 py-3 lg:px-8">
                    <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
                        <Image src="/BPI1.png" alt="BPI logo" width={38} height={38} className="rounded-md bg-white object-contain p-0.5" />
                        <span className="text-xl font-bold tracking-tight">BPI <span className="font-normal">Bank</span></span>
                    </Link>

                    <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
                        {navItems.map(([href, label]) => <NavItem key={href} href={href} label={label} pathname={pathname} />)}
                    </nav>
                    <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex xl:hidden">
                        {navItems.map(([href, label]) => <NavItem key={href} href={href} label={label} pathname={pathname} compact />)}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <button type="button" aria-label="Search" className="hidden rounded-md p-2 transition hover:bg-white/10 sm:block"><Search size={19} /></button>
                        <button type="button" aria-label="Notifications" className="hidden rounded-md p-2 transition hover:bg-white/10 sm:block"><Bell size={19} /></button>
                        <div className="relative hidden xl:block">
                            <button
                                type="button"
                                aria-expanded={profileOpen}
                                onClick={() => setProfileOpen((open) => !open)}
                                className="flex items-center gap-2 border-l border-white/25 pl-3 text-left"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--brand-gold) text-sm font-bold text-(--brand-red-dark)">{profileInitials}</span>
                                <span className="max-w-28 truncate text-sm font-semibold">{profileName}</span>
                                <ChevronDown size={16} className={profileOpen ? "rotate-180 transition" : "transition"} />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 top-12 w-52 rounded-md bg-white p-2 text-stone-900 shadow-xl ring-1 ring-black/10">
                                    <div className="border-b border-stone-100 px-3 py-2">
                                        <p className="truncate text-sm font-semibold">{profileName}</p>
                                        <p className="mt-0.5 text-xs text-stone-500">Personal account</p>
                                    </div>
                                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="mt-1 block rounded px-3 py-2 text-sm hover:bg-red-50 hover:text-(--brand-red)">Profile and settings</Link>
                                </div>
                            )}
                        </div>
                        <button type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)} className="rounded-md p-3 transition hover:bg-white/10 md:hidden">
                            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </div>
                {mobileOpen && (
                    <nav className="border-t border-white/15 px-5 py-3 md:hidden">
                        <div className="grid gap-1 sm:grid-cols-2">
                            {navItems.map(([href, label]) => (
                                <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={`rounded-md px-3 py-3 text-sm font-semibold ${isNavItemActive(href, pathname) ? "bg-white text-(--brand-red)" : "text-white/85 hover:bg-white/10"}`}>
                                    {label}
                                </Link>
                            ))}
                            <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-3 text-sm font-semibold text-white/85 hover:bg-white/10">Settings</Link>
                        </div>
                    </nav>
                )}
            </header>
            <main className="dashboard-page min-h-[calc(100vh-4.5rem)]">{children}</main>
        </div>
    );
}

function NavItem({
    href,
    label,
    pathname,
    compact = false,
}: {
    href: string;
    label: string;
    pathname: string;
    compact?: boolean;
}) {
    const isActive = isNavItemActive(href, pathname);

    return (
        <Link
            href={href}
            className={`whitespace-nowrap rounded-md ${compact ? "px-2 text-xs" : "px-3 text-sm"} py-2.5 font-semibold transition ${isActive
                ? "bg-white text-(--brand-red)"
                : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
        >
            {label}
        </Link>
    );
}

function isNavItemActive(href: string, pathname: string) {
    return href === "/dashboard"
        ? pathname === href || pathname === `${href}/`
        : pathname === href || pathname.startsWith(`${href}/`);
}