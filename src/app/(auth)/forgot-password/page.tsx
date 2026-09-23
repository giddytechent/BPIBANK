import Link from "next/link";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      panel={
        <AuthPanel
          eyebrow="Account support"
          title="Password reset,"
          titleHighlight="coming soon."
          description="We are preparing a secure self-service password reset experience for BPI Bank customers."
        />
      }
    >
      <section className="rounded-md border border-stone-200 bg-white p-6 text-stone-900 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-red)">
          Account access
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-950">
          Forgot your password?
        </h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">
          Password reset is not available in this portfolio banking simulator yet.
          Please return to sign in or contact support for assistance.
        </p>
        <Link href="/login" className="marketing-button-primary mt-8 w-full">
          Return to sign in
        </Link>
      </section>
    </AuthShell>
  );
}
