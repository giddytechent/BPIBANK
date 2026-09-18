import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Eye,
  HandCoins,
  Landmark,
  ShieldCheck,
  Users,
} from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "Clarity by default",
    description:
      "Your balance, activity, and next move should always be easy to understand.",
  },
  {
    icon: ShieldCheck,
    title: "Trust built in",
    description:
      "Strong authentication and careful authorization protect every account interaction.",
  },
  {
    icon: HandCoins,
    title: "Useful every day",
    description:
      "Thoughtful tools make transfers, cards, and account management feel effortless.",
  },
];

const milestones = [
  ["01", "Open your account", "Create a secure profile in a few simple steps."],
  ["02", "Make it yours", "Add accounts, cards, and the details you need."],
  ["03", "Move with confidence", "Send money and follow every transaction from one place."],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-800 text-white">
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute -right-40 top-8 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-48 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-8 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <Landmark className="h-4 w-4" />
              Banking, with a clearer point of view
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-7xl">
              Money should feel
              <span className="block text-blue-400">less complicated.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              BPI BANK brings the essentials of everyday banking into one calm,
              capable place. We believe better financial tools give people more
              room to focus on what their money makes possible.
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
                href="#principles"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:bg-white/10"
              >
                What guides us
              </Link>
            </div>
          </div>

          <div className="relative lg:pb-3">
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-600/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-7 shadow-2xl backdrop-blur sm:p-9">
              <div className="flex items-start justify-between border-b border-white/10 pb-7">
                <div>
                  <p className="text-sm text-slate-500">Our north star</p>
                  <p className="mt-2 text-2xl font-semibold">More control. Less noise.</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10">
                  <CircleDollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-7">
                <div>
                  <p className="text-3xl font-bold text-blue-400">1</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">focused place for your everyday finances</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">0</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">guesswork between you and your money</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
                <BadgeCheck className="h-5 w-5 shrink-0" />
                Built around transparency and control
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="principles" className="border-b border-white/10 bg-slate-900/45">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">What we believe</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good banking gets out of the way.</h2>
            <p className="mt-5 leading-7 text-slate-400">
              The best financial experience is one that helps you act with confidence without asking you to become an expert first.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <div key={principle.title} className="rounded-2xl border border-white/10 bg-white/3 p-7 transition hover:-translate-y-1 hover:bg-white/6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                    <Icon className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{principle.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">The BPI way</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From first login to everyday confidence.</h2>
            <p className="mt-5 leading-7 text-slate-400">
              Every part of the experience is designed to make the next financial decision feel a little more straightforward.
            </p>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {milestones.map(([number, title, description]) => (
              <div key={number} className="grid gap-4 py-6 sm:grid-cols-[64px_1fr] sm:items-start">
                <span className="text-sm font-semibold text-blue-400">{number}</span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-blue-800 px-6 py-16 text-center sm:px-12">
            <Users className="mx-auto h-8 w-8 text-blue-100" />
            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">A better relationship with your money starts here.</h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">Simple tools, clear information, and the confidence to move forward.</p>
            <Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-slate-100">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}