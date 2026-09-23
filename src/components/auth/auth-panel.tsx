import { Check } from "lucide-react";
import Image from "next/image";
import type { ComponentType, ReactNode } from "react";

type AuthPanelProps = {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  description: string;
  children?: ReactNode;
};

export function AuthPanel({
  eyebrow,
  title,
  titleHighlight,
  description,
  children,
}: AuthPanelProps) {
  return (
    <>
      <section className="marketing-pattern relative overflow-hidden rounded-md px-6 py-10 text-white lg:hidden">
        <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rotate-45 border-[2rem] border-(--marketing-gold)/90" />
        <div className="relative z-10 max-w-lg">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--marketing-gold)">
            <span className="h-1 w-8 bg-(--marketing-gold)" />
            {eyebrow}
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight">
            {title}
            {titleHighlight ? (
              <span className="mt-1 block text-(--marketing-gold)">{titleHighlight}</span>
            ) : null}
          </h1>
        </div>
      </section>

      <section className="relative hidden min-h-128 overflow-hidden rounded-md lg:flex lg:flex-col">
        <div className="marketing-pattern absolute inset-0 text-white" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rotate-45 border-[3rem] border-(--marketing-gold)/90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rotate-45 border-[4rem] border-(--marketing-red)/70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[28%] top-0 h-full w-px bg-white/20"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-14 right-10 hidden aspect-612/471 w-52 overflow-hidden border-4 border-white/20 shadow-2xl xl:block xl:w-64"
        >
          <Image
            src="/block2-digitalization-1.png"
            alt=""
            fill
            sizes="16rem"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-(--marketing-red-dark)/25" />
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-(--marketing-gold)" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col justify-between p-10 xl:p-12">
          <div className="max-w-lg">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-(--marketing-gold)">
              <span className="h-1 w-8 bg-(--marketing-gold)" />
              {eyebrow}
            </p>

            <h1 className="mt-7 text-4xl font-bold leading-[1.02] tracking-[-0.03em] xl:text-5xl">
              {title}
              {titleHighlight ? (
                <span className="mt-2 block text-(--marketing-gold)">{titleHighlight}</span>
              ) : null}
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/85">{description}</p>

            {children ? <div className="mt-10 space-y-4">{children}</div> : null}
          </div>

          <p className="text-sm text-white/60">© 2026 BPI Bank</p>
        </div>
      </section>
    </>
  );
}

export function AuthPanelFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10 text-(--marketing-gold)">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/70">{description}</p>
      </div>
    </div>
  );
}

export function AuthPanelBenefit({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
        <Check className="h-3.5 w-3.5 text-(--marketing-gold)" />
      </div>
      <span className="text-sm text-white/90">{children}</span>
    </div>
  );
}
