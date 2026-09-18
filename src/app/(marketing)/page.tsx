import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant transfers",
    description:
      "Send money quickly and easily with a simple, secure transfer experience.",
  },
  {
    icon: CreditCard,
    title: "Smart cards",
    description:
      "Manage your virtual cards, monitor activity, and stay in control of your spending.",
  },
  {
    icon: LockKeyhole,
    title: "Built with security",
    description:
      "Your account information is protected with modern authentication and authorization.",
  },
];

const benefits = [
  "Simple account management",
  "Real-time transaction history",
  "Secure money transfers",
  "Virtual card management",
];

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-slate-800 text-white">
      {/* Navigation */}

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-125 w-175 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-28">
          {/* Hero copy */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Sparkles className="h-4 w-4" />
              Banking made beautifully simple
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your money.
              <span className="block text-blue-500">
                Your control.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              A modern banking experience designed to make managing your
              money simple, transparent, and effortless.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
              >
                Open an account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Explore features
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                Simple dashboard
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                Secure access
              </span>

              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                Easy transfers
              </span>
            </div>
          </div>

          {/* Banking app preview */}
          <div className="relative mx-auto w-full max-w-xl">
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

      {/* Features */}
      <section
        id="features"
        className="border-t border-white/10 bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Banking without the unnecessary complexity.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Manage your accounts, transfers, cards, and transaction
              history from one intuitive dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/3 p-7 transition hover:-translate-y-1 hover:bg-white/5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need to manage your finances.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              GiddyBank brings your everyday banking activities together
              in one clean and easy-to-use experience.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-400 hover:text-blue-300"
            >
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/3 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                  {index + 1}
                </div>

                <span className="text-slate-200">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="border-y border-white/10 bg-slate-900/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <LockKeyhole className="h-6 w-6 text-blue-400" />
          </div>

          <h2 className="mt-6 text-3xl font-bold">
            Designed with security in mind.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            From authenticated sessions to server-side authorization,
            every banking operation is designed around protecting user
            data and preventing unauthorized actions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-blue-800 px-6 py-16 text-center sm:px-12">
            <Smartphone className="mx-auto h-8 w-8 text-blue-100" />

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              A simpler way to bank.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Experience a modern banking interface built for
              simplicity, speed, and control.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}