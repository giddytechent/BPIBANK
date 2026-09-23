import type { ReactNode } from "react";

type AuthFormCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthFormCard({
  title,
  description,
  children,
}: AuthFormCardProps) {
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

export function AuthFormFallback({ label }: { label: string }) {
  return (
    <div
      className="rounded-md border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-sm text-stone-500">Loading {label}...</p>
    </div>
  );
}
