import Link from "next/link";
import { ArrowRight, Eye, HandCoins, Landmark, ShieldCheck } from "lucide-react";

const principles = [
  {
    icon: Eye,
    number: "01",
    title: "Clarity by default",
    description: "Your balance, activity, and next move should always be easy to understand.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Trust built in",
    description: "Strong access controls and careful authorization protect every account interaction.",
  },
  {
    icon: HandCoins,
    number: "03",
    title: "Useful every day",
    description: "Thoughtful tools make transfers, cards, and account management easier to navigate.",
  },
];

const milestones = [
  ["01", "Open your account", "Create a secure profile in a few simple steps."],
  ["02", "Make it yours", "Add accounts, cards, and the details you need."],
  ["03", "Move with confidence", "Send money and follow every transaction from one place."],
] as const;

export default function AboutPage() {
  return (
    <main className="marketing-page overflow-hidden">
      <section className="marketing-pattern relative overflow-hidden text-white">
        <div aria-hidden="true" className="absolute -left-20 bottom-0 h-72 w-72 rotate-45 border-[3.5rem] border-(--marketing-gold)/90" />
        <div aria-hidden="true" className="absolute -right-24 top-0 h-96 w-96 rotate-45 border-[4rem] border-(--marketing-red)/70" />
        <div className="marketing-container relative py-22 sm:py-28 lg:py-36">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--marketing-gold)">
              <Landmark className="h-4 w-4" />
              About BPI Bank
            </p>
            <h1 className="mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Progress is personal.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              Better financial tools give people more room to focus on what their money makes possible. That is the clearer point of view behind BPI Bank.
            </p>
          </div>
        </div>
      </section>

      <section className="marketing-section-divider bg-(--marketing-surface)">
        <div className="marketing-container grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
          <p className="marketing-eyebrow">Our purpose</p>
          <div>
            <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-(--marketing-text) sm:text-4xl">
              Bring the essentials of everyday banking into one calm, capable place.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-(--marketing-text-muted)">
              We believe banking should make the next decision feel more straightforward—whether you are checking an account, moving money, or keeping track of what matters.
            </p>
          </div>
        </div>
      </section>

      <section id="principles" className="marketing-section-divider bg-(--marketing-surface-muted)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="marketing-eyebrow">What we believe</p>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-(--marketing-text) sm:text-4xl">Good banking gets out of the way.</h2>
          </div>
          <div className="mt-12 grid border-t border-(--marketing-border) md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;

              return (
                <article key={principle.title} className="border-b border-(--marketing-border) px-0 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                  <div className="flex items-start justify-between gap-5">
                    <Icon className="h-7 w-7 text-(--marketing-red)" />
                    <span className="text-sm font-extrabold tracking-[0.1em] text-(--marketing-gold)">{principle.number}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold text-(--marketing-text)">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-(--marketing-text-muted)">{principle.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="marketing-section-divider bg-(--marketing-surface)">
        <div className="marketing-container grid gap-12 py-20 sm:py-24 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="marketing-eyebrow">The BPI way</p>
            <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-(--marketing-text) sm:text-4xl">From first login to everyday confidence.</h2>
            <p className="mt-5 leading-7 text-(--marketing-text-muted)">
              Every part of the experience is designed to make the next financial decision feel a little more straightforward.
            </p>
          </div>
          <ol className="border-t border-(--marketing-red)">
            {milestones.map(([number, title, description]) => (
              <li key={number} className="grid gap-4 border-b border-(--marketing-border) py-7 sm:grid-cols-[5rem_1fr]">
                <span className="text-xl font-extrabold text-(--marketing-gold)">{number}</span>
                <div>
                  <h3 className="text-xl font-bold text-(--marketing-text)">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-(--marketing-text-muted)">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-(--marketing-page-background)">
        <div className="marketing-container py-20 sm:py-24">
          <div className="marketing-pattern relative overflow-hidden px-7 py-16 text-center text-white shadow-xl sm:px-12 sm:py-20">
            <div aria-hidden="true" className="absolute -left-14 bottom-0 h-48 w-48 rotate-45 border-[2.75rem] border-(--marketing-gold)/90" />
            <div aria-hidden="true" className="absolute -right-16 top-0 h-52 w-52 rotate-45 border-[3rem] border-(--marketing-red)/75" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-(--marketing-gold)">Bank with BPI Bank</p>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">A better relationship with your money starts here.</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">Simple tools, clear information, and the confidence to move forward.</p>
              <Link href="/register" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-(--marketing-red) transition hover:bg-(--marketing-gold) hover:text-(--marketing-red-dark)">
                Open an account
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
