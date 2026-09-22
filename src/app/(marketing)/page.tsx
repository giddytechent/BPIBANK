import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    label: "Personal banking",
    title: "Everyday banking",
    description:
      "See your accounts, understand your balances, and move money when life calls for it.",
    href: "/dashboard/accounts",
    linkLabel: "Explore accounts",
  },
  {
    icon: CreditCard,
    label: "Cards and payments",
    title: "Cards that stay in your control",
    description:
      "Keep card activity and spending visibility close, so every payment feels easier to manage.",
    href: "/dashboard/cards",
    linkLabel: "Manage cards",
  },
  {
    icon: LockKeyhole,
    label: "Digital banking",
    title: "A clearer digital banking view",
    description:
      "Follow transaction history and access your banking information through one secure experience.",
    href: "/dashboard/transactions",
    linkLabel: "View transactions",
  },
];

const benefits = [
  "Simple account management",
  "Real-time transaction history",
  "Secure money transfers",
  "Virtual card management",
];

const progressStories = [
  {
    image: "/block1-sustainability-1.png",
    alt: "Wind turbines in a green valley",
    label: "Sustainable progress",
    title: "Helping progress move responsibly.",
    description: "Financial choices can support the communities and future we want to build together.",
  },
  {
    image: "/block2-digitalization-1.png",
    alt: "Customer using a smartphone with digital light trails",
    label: "Digital banking",
    title: "Digital banking made clearer.",
    description: "Useful tools and clear information help make everyday banking easier to navigate.",
  },
  {
    image: "/block3-financial-education-1.png",
    alt: "People taking part in a financial education session",
    label: "Financial confidence",
    title: "Knowledge for every next step.",
    description: "Practical financial confidence begins with access to information that makes sense.",
  },
] as const;

export default function MarketingPage() {
  return (
    <main className="marketing-page overflow-hidden">
      {/* Navigation */}

      {/* Hero */}
      <section className="marketing-pattern relative isolate overflow-hidden text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-12 h-80 w-80 rotate-45 border-[3rem] border-(--marketing-red)/70" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rotate-45 border-[4rem] border-(--marketing-gold)/90" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[28%] top-0 h-full w-px bg-white/20" />

        <div className="marketing-container relative z-10 grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-20 lg:py-32">
          {/* Hero copy */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--marketing-gold)">
              <span className="h-1 w-8 bg-(--marketing-gold)" />
              Banking for everyday progress
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              Banking that moves with your life.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              Manage your accounts, make secure transfers, and keep every financial decision within clear reach.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-(--marketing-red) transition hover:bg-(--marketing-gold) hover:text-(--marketing-red-dark)"
              >
                Open an account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#features"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/70 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white/10"
              >
                Explore our services
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-(--marketing-gold)" />
                Clear account access
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-(--marketing-gold)" />
                Secure access
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-(--marketing-gold)" />
                Confident transfers
              </span>
            </div>
          </div>

          <aside className="relative bg-(--marketing-surface) p-7 text-(--marketing-text) shadow-2xl sm:p-9 lg:translate-y-12">
            <div aria-hidden="true" className="absolute right-0 top-0 h-12 w-12 border-b-[3rem] border-l-[3rem] border-b-transparent border-l-(--marketing-gold)" />
            <p className="marketing-eyebrow">Bank with confidence</p>
            <h2 className="mt-5 max-w-xs text-3xl font-bold leading-tight tracking-tight">
              One clear place for your money.
            </h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-(--marketing-text-muted)">
              Stay on top of balances, cards, transfers, and transaction activity whenever you need to.
            </p>
            <div className="mt-8 grid grid-cols-3 border-y border-(--marketing-border)">
              {[
                ["Accounts", "Clear"],
                ["Transfers", "Secure"],
                ["Access", "Simple"],
              ].map(([label, value]) => (
                <div key={label} className="border-r border-(--marketing-border) px-3 py-4 last:border-r-0 sm:px-4">
                  <p className="text-lg font-bold text-(--marketing-red)">{value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-(--marketing-text-muted)">{label}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* Retained temporarily while lower marketing sections are redesigned. */}
          <div className="hidden" aria-hidden="true">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-600/20 blur-3xl" />

            <div className="relative rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur">
              {/* Fake browser/app header */}
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-xs text-slate-500">
                    GiddyBank
                  </p>
                  <p className="text-sm font-medium text-white">
                    Overview
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-400">
                  G
                </div>
              </div>

              {/* Balance card */}
              <div className="rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-blue-100">
                      Total balance
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      $1,250,000
                    </p>
                  </div>

                  <Wallet className="h-6 w-6 text-blue-100" />
                </div>

                <div className="mt-12 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-blue-200">
                      Account
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      •••• 4821
                    </p>
                  </div>

                  <p className="text-xs text-blue-200">
                    USD
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  ["Transfer", ArrowRight],
                  ["Cards", CreditCard],
                  ["Account", Wallet],
                ].map(([label, Icon]) => {
                  const IconComponent = Icon as typeof ArrowRight;

                  return (
                    <button
                      key={label as string}
                      className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/3 p-4 transition hover:bg-white/[0.07]"
                    >
                      <IconComponent className="h-5 w-5 text-blue-400" />
                      <span className="text-xs text-slate-300">
                        {label as string}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Recent transactions */}
              <div className="mt-5 rounded-xl border border-white/10 bg-white/2 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Recent transactions
                  </h3>

                  <span className="text-xs text-blue-400">
                    View all
                  </span>
                </div>

                {[
                  {
                    name: "Salary",
                    amount: "+$250,000",
                  },
                  {
                    name: "Transfer",
                    amount: "-$50,000",
                  },
                  {
                    name: "Subscription",
                    amount: "-$8,500",
                  },
                ].map((transaction) => (
                  <div
                    key={transaction.name}
                    className="flex items-center justify-between border-t border-white/5 py-3 first:border-t-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                        <Wallet className="h-4 w-4 text-blue-400" />
                      </div>

                      <span className="text-sm text-slate-300">
                        {transaction.name}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-medium ${
                        transaction.amount.startsWith("+")
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product entry points */}
      <section id="features" className="marketing-section-divider bg-(--marketing-surface-muted)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="marketing-eyebrow">Explore BPI Bank</p>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--marketing-text) sm:text-4xl">
              The banking essentials, made more useful.
            </h2>

            <p className="mt-5 leading-7 text-(--marketing-text-muted)">
              Choose the tools that help you see clearly, pay confidently, and keep moving forward.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative border border-(--marketing-border) bg-(--marketing-surface) p-7 shadow-[0_10px_24px_oklch(0.2_0.02_25_/_0.05)] transition hover:-translate-y-1 hover:border-(--marketing-red) sm:p-8"
                >
                  <div aria-hidden="true" className="absolute right-0 top-0 h-0 w-0 border-b-[2rem] border-l-[2rem] border-b-transparent border-l-(--marketing-gold)" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-(--marketing-red) text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.12em] text-(--marketing-red)">{feature.label}</p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight text-(--marketing-text)">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-sm leading-6 text-(--marketing-text-muted)">
                    {feature.description}
                  </p>
                  <Link href={feature.href} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-(--marketing-red) transition group-hover:text-(--marketing-red-dark)">
                    {feature.linkLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketing-section-divider bg-(--marketing-page-background)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="marketing-eyebrow">Building progress</p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--marketing-text) sm:text-4xl">
              The ideas behind a more confident future.
            </h2>
            <p className="mt-5 leading-7 text-(--marketing-text-muted)">
              Explore how clearer access, shared knowledge, and responsible choices can make a meaningful difference.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {progressStories.map((story) => (
              <article key={story.title} className="group overflow-hidden border border-(--marketing-border) bg-(--marketing-surface) shadow-[0_10px_24px_oklch(0.2_0.02_25_/_0.05)]">
                <div className="relative aspect-[612/471] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.alt}
                    width={612}
                    height={471}
                    sizes="(max-width: 1023px) calc(100vw - 4rem), 26rem"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div aria-hidden="true" className="absolute left-0 top-0 h-0 w-0 border-b-[3rem] border-r-[3rem] border-b-transparent border-r-(--marketing-gold)" />
                  <div aria-hidden="true" className="absolute bottom-0 left-0 h-1.5 w-full bg-(--marketing-red)" />
                </div>
                <div className="p-7 sm:p-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-(--marketing-red)">{story.label}</p>
                  <h3 className="mt-3 text-2xl font-bold leading-tight text-(--marketing-text)">{story.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-(--marketing-text-muted)">{story.description}</p>
                  <p className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-(--marketing-red)">
                    Read more
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marketing-section-divider bg-(--marketing-surface-muted)">
        <div className="marketing-container space-y-10 py-20 sm:space-y-14 sm:py-24">
          <div className="grid overflow-hidden border border-(--marketing-border) lg:grid-cols-2">
            <div className="bg-(--marketing-surface) p-8 sm:p-12 lg:p-16">
              <p className="marketing-eyebrow">Move money with confidence</p>
              <h2 className="mt-5 max-w-md text-3xl font-bold leading-tight tracking-tight text-(--marketing-text) sm:text-4xl">
                Secure money movement, built for everyday decisions.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-(--marketing-text-muted)">
                Send money with a clear view of the details that matter, from the amount and recipient to the status of every transfer.
              </p>
              <Link href="/dashboard/transfers" className="marketing-button-primary mt-8">
                Explore transfers
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>

            <div className="marketing-pattern relative min-h-80 overflow-hidden p-8 text-white sm:p-12" aria-hidden="true">
              <div className="absolute -right-12 top-10 h-64 w-64 rotate-45 border-[2.5rem] border-(--marketing-gold)/90" />
              <div className="relative mt-12 max-w-sm border border-white/35 bg-(--marketing-red-dark)/80 p-6 shadow-xl sm:ml-auto sm:mt-16">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--marketing-gold)">Transfer overview</span>
                  <Send className="h-6 w-6 text-(--marketing-gold)" />
                </div>
                <p className="mt-8 text-3xl font-bold">Clear from start to finish.</p>
                <div className="mt-7 h-px bg-white/30" />
                <div className="mt-5 flex justify-between text-sm text-white/80">
                  <span>Details</span>
                  <span>In view</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid overflow-hidden border border-(--marketing-border) lg:grid-cols-2">
            <div className="marketing-pattern relative min-h-80 overflow-hidden p-8 text-white sm:p-12 lg:order-1" aria-hidden="true">
              <div className="absolute -left-16 bottom-0 h-64 w-64 rotate-45 bg-(--marketing-gold)" />
              <div className="relative mt-10 max-w-sm border-l-4 border-(--marketing-gold) bg-white p-6 text-(--marketing-text) shadow-xl sm:mt-16">
                <ShieldCheck className="h-8 w-8 text-(--marketing-red)" />
                <p className="mt-6 text-2xl font-bold leading-tight">Protection that stays visible.</p>
                <p className="mt-3 text-sm leading-6 text-(--marketing-text-muted)">Clear settings and a secure account experience help you stay in control.</p>
              </div>
            </div>

            <div className="bg-(--marketing-surface) p-8 sm:p-12 lg:order-2 lg:p-16">
              <p className="marketing-eyebrow">Protection and transparency</p>
              <h2 className="mt-5 max-w-md text-3xl font-bold leading-tight tracking-tight text-(--marketing-text) sm:text-4xl">
                Banking protection should be easy to understand.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-(--marketing-text-muted)">
                Review account settings and transaction information in one place, with a simpler path to the controls that keep your banking experience secure.
              </p>
              <Link href="/dashboard/settings" className="marketing-button-secondary mt-8">
                Review security settings
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      

      <section id="security" className="marketing-section-divider bg-(--marketing-surface)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-sm border border-(--marketing-border) border-t-4 border-t-(--marketing-red) bg-(--marketing-surface-muted)">
              <LockKeyhole className="h-6 w-6 text-(--marketing-red)" />
            </div>
            <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.14em] text-(--marketing-red)">Banking you can follow</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-(--marketing-text) sm:text-4xl">
              Protection that stays clear and close at hand.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-(--marketing-text-muted)">
              Secure access, clear transaction information, and account controls help you stay informed about the activity that matters to you.
            </p>
            <div aria-hidden="true" className="mx-auto mt-8 h-1 w-16 bg-(--marketing-red)" />
          </div>
        </div>
      </section>

      <section className="bg-(--marketing-page-background)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="marketing-pattern relative overflow-hidden px-7 py-16 text-center text-white shadow-xl sm:px-12 sm:py-20">
            <div aria-hidden="true" className="absolute -left-16 top-0 h-48 w-48 rotate-45 border-[2.5rem] border-(--marketing-gold)/90" />
            <div aria-hidden="true" className="absolute -bottom-24 right-4 h-64 w-64 rotate-45 border-[3.5rem] border-(--marketing-red)/80" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--marketing-gold)">Your next step</p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
                Start banking with more confidence.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">
                Open an account for clear, everyday access to the financial tools that help you move forward.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-(--marketing-red) transition hover:bg-(--marketing-gold) hover:text-(--marketing-red-dark)">
                  Open an account
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/70 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:border-white hover:bg-white/10">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
