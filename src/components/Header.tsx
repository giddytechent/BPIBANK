import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b border-white/10  bg-slate-900 text-white">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/BPI1.png"
                        alt="BPI logo"
                        width="50"
                        height="50"
                        className="border rounded-xl"
                    />

                    <span className="text-xl font-bold tracking-tight">
                        BPI BANK
                    </span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
                    <Link
                        href="#features"
                        className="transition hover:text-white"
                    >
                        Features
                    </Link>

                    <Link
                        href="#how-it-works"
                        className="transition hover:text-white"
                    >
                        How it works
                    </Link>

                    <Link
                        href="#security"
                        className="transition hover:text-white"
                    >
                        Security
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
                    >
                        Sign in
                    </Link>

                    <Link
                        href="/register"
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </header>
    )
}