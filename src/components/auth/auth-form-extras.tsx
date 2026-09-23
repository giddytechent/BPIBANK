import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { authLinkClassName } from "@/components/auth/auth-styles";

export function AuthAlternateLink({
  prompt,
  linkHref,
  linkLabel,
}: {
  prompt: string;
  linkHref: string;
  linkLabel: string;
}) {
  return (
    <p className="mt-8 text-center text-sm text-stone-500">
      {prompt}{" "}
      <Link href={linkHref} className={authLinkClassName}>
        {linkLabel}
      </Link>
    </p>
  );
}

export function AuthSecurityNote() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-500">
      <ShieldCheck className="h-4 w-4 text-(--brand-red)" />
      <span>Protected account access</span>
      <LockKeyhole className="h-4 w-4 text-(--brand-red)" />
    </div>
  );
}
