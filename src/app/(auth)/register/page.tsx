import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { RegisterPanel } from "@/components/auth/register-panel";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell panel={<RegisterPanel />}>
      <Suspense fallback={<RegisterFormFallback />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}

function RegisterFormFallback() {
  return (
    <div
      className="rounded-md border border-stone-200 bg-white p-8 shadow-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-sm text-stone-500">Loading registration…</p>
    </div>
  );
}
