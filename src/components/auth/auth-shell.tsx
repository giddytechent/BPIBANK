import type { ReactNode } from "react";

type AuthShellProps = {
  panel: ReactNode;
  children: ReactNode;
};

export function AuthShell({ panel, children }: AuthShellProps) {
  return (
    <main className="marketing-page min-h-full py-8 sm:py-12 lg:py-16">
      <div className="marketing-container grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-stretch lg:gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,28rem)]">
        {panel}
        <section className="flex w-full items-center justify-center lg:justify-end">
          <div className="w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}

export function AuthFormCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-6 text-stone-900 shadow-sm sm:p-8">
      <header className="mb-8 border-b border-stone-100 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-red)">
          Secure access
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
      </header>
      {children}
    </div>
  );
}
