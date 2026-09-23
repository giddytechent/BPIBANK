"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthHeader() {
  const pathname = usePathname();
  const isRegister = pathname === "/register";

  return (
    <header className="marketing-pattern sticky top-0 z-30 border-b border-white/20 text-white shadow-md">
      <div className="marketing-container flex min-h-16 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-white"
          aria-label="BPI Bank home"
        >
          <Image
            src="/BPI1.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-md bg-white p-0.5 object-contain"
          />
          <span className="text-xl leading-none tracking-tight sm:text-2xl">
            <strong>BPI</strong> Bank
          </span>
        </Link>

        <Link
          href={isRegister ? "/login" : "/register"}
          className="inline-flex min-h-11 items-center justify-center rounded-sm bg-white px-4 py-2.5 text-xs font-bold tracking-[0.12em] text-(--brand-red) transition hover:bg-(--brand-gold) hover:text-(--brand-red-dark) sm:px-5"
        >
          {isRegister ? "LOGIN" : "OPEN ACCOUNT"}
        </Link>
      </div>
    </header>
  );
}
