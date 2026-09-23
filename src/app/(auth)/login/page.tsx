import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LoginPanel } from "@/components/auth/login-panel";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell panel={<LoginPanel />}>
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

function LoginFormFallback() {
  return (
    <div
      className="rounded-md border border-stone-200 bg-white p-8 shadow-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-sm text-stone-500">Loading sign in…</p>
    </div>
  );
}
