import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    title: "Personal banking",
    links: [
      ["Accounts", "/#features"],
      ["Transfers", "/#how-it-works"],
      ["Cards", "/#features"],
      ["Digital banking", "/#security"],
    ],
  },
  {
    title: "About BPI",
    links: [
      ["Our story", "/about"],
      ["Security", "/#security"],
      ["Contact us", "mailto:support@bpibank.example"],
      ["Careers", "/about"],
    ],
  },
  {
    title: "Get started",
    links: [
      ["Open an account", "/register"],
      ["Sign in", "/login"],
      ["Dashboard", "/dashboard"],
      ["Help centre", "mailto:support@bpibank.example"],
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="border-t-4 border-(--brand-red) bg-(--dashboard-white) text-(--dashboard-text)">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1.35fr_repeat(3,0.8fr)] lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3 rounded-sm">
            <Image src="/BPI1.png" alt="" width={48} height={48} className="h-12 w-12 object-contain" />
            <span className="text-3xl font-bold tracking-tight text-(--brand-red)">BPI</span>
          </Link>
          <p className="mt-6 text-lg font-semibold leading-7 text-(--dashboard-text)">
            Banking built around the progress you want to make.
          </p>
          <p className="mt-3 text-sm leading-6 text-(--dashboard-text-muted)">
            Clear everyday tools for managing your accounts, cards, and money movement with confidence.
          </p>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-(--dashboard-text-muted)">
            Bank of the Philippine Islands
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="border-l-4 border-(--brand-gold) pl-3 text-sm font-bold uppercase tracking-[0.1em] text-(--dashboard-text)">
              {column.title}
            </h2>
            <ul className="mt-5 space-y-3">
              {column.links.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-(--dashboard-text-muted) transition hover:text-(--brand-red)">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-(--dashboard-border)">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-xs text-(--dashboard-text-muted) sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>(c) {new Date().getFullYear()} BPI Bank. Banking for everyday progress.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-(--brand-red)">Privacy</Link>
            <Link href="/about" className="hover:text-(--brand-red)">Terms of use</Link>
            <Link href="/about" className="hover:text-(--brand-red)">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
