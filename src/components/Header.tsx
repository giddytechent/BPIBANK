"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Personal Banking", href: "/#features" },
  { label: "Wealth Management", href: "/#how-it-works" },
  { label: "SME Banking", href: "/#features" },
  { label: "Institutional Banking", href: "/#security" },
  { label: "About BPI", href: "/about" },
] as const;

const searchOptions = [
  ...navigation,
  { label: "Open an account", href: "/register" },
  { label: "Sign in", href: "/login" },
] as const;

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const matchingOptions = searchOptions.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()),
  );

  return (
    <header className="marketing-pattern sticky top-0 z-30 border-b border-white/20 text-white shadow-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:outline-white" aria-label="BPI Bank home">
          <Image src="/BPI1.png" alt="" width={42} height={42} className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold leading-none tracking-tight">BPI</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className="group inline-flex items-center gap-1 whitespace-nowrap rounded-sm px-3 py-2.5 text-sm font-semibold text-white/95 transition hover:bg-white/10 hover:text-white">
              {item.label}
              {/* <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" /> */}
            </Link>
          ))}
        </nav>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex lg:hidden" aria-label="Primary navigation">
          {navigation.slice(0, 2).map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded-sm px-2.5 text-xs font-semibold text-white/95 transition hover:bg-white/10 hover:text-white">
              {item.label}
              <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button type="button" aria-label="Search BPI Bank navigation" aria-expanded={searchOpen} aria-controls="marketing-search" onClick={() => setSearchOpen((open) => !open)} className="hidden min-h-11 min-w-11 items-center justify-center rounded-sm transition hover:bg-white/10 sm:inline-flex">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-sm bg-white px-4 py-2.5 text-xs font-bold tracking-[0.12em] text-(--brand-red) transition hover:bg-(--brand-gold) hover:text-(--brand-red-dark) sm:px-5">
            LOGIN
          </Link>
          <button type="button" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="marketing-mobile-navigation" onClick={() => setMobileOpen((open) => !open)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm transition hover:bg-white/10 lg:hidden">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div id="marketing-search" className="absolute right-5 top-full z-40 mt-2 w-[min(calc(100vw-2.5rem),24rem)] border border-(--marketing-border) bg-(--marketing-surface) p-4 text-(--marketing-text) shadow-xl lg:right-8" role="search">
          <label htmlFor="marketing-navigation-search" className="text-xs font-extrabold uppercase tracking-[0.1em] text-(--marketing-red)">Find a destination</label>
          <input id="marketing-navigation-search" type="search" autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setSearchOpen(false); }} placeholder="Search banking, cards, sign in…" className="mt-3 min-h-11 w-full rounded-sm border border-(--marketing-border) bg-white px-3 text-sm text-(--marketing-text) placeholder:text-(--marketing-text-muted)" />
          <ul className="mt-3 max-h-56 overflow-y-auto border-t border-(--marketing-border)">
            {matchingOptions.length > 0 ? matchingOptions.map((item) => (
              <li key={item.label}>
                <Link href={item.href} onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="flex min-h-11 items-center border-b border-(--marketing-border) px-2 text-sm font-semibold text-(--marketing-text) transition hover:bg-(--marketing-surface-muted) hover:text-(--marketing-red)">
                  {item.label}
                </Link>
              </li>
            )) : <li className="px-2 py-3 text-sm text-(--marketing-text-muted)">No matching destinations.</li>}
          </ul>
        </div>
      )}

      {mobileOpen && (
        <nav id="marketing-mobile-navigation" className="border-t border-white/20 bg-(--brand-red-dark)/95 px-5 py-4 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-sm px-3 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                {item.label}
                <ChevronDown aria-hidden="true" className="h-4 w-4 -rotate-90" />
              </Link>
            ))}
            <Link href="/register" onClick={() => setMobileOpen(false)} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-sm bg-(--brand-gold) px-3 py-3 text-center text-sm font-bold text-(--brand-red-dark)">
              Open an account
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
