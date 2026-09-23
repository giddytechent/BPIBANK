"use client";

import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function AccountNumber({ accountNumber }: { accountNumber: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const copyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const label = isVisible ? accountNumber : `•••• ${accountNumber.slice(-4)}`;

  return (
    <div className="mt-1 flex items-center gap-1">
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-pressed={isVisible}
        className="inline-flex min-h-9 items-center gap-2 rounded-md px-1 text-left text-sm text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
      >
        <span className="font-medium tracking-wide">{label}</span>
        {isVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
        <span className="sr-only">{isVisible ? "Hide account number" : "Show account number"}</span>
      </button>

      {isVisible ? (
        <button
          type="button"
          onClick={copyAccountNumber}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-(--brand-red) transition hover:bg-red-50"
          aria-label="Copy account number"
        >
          {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        </button>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? "Account number copied to clipboard" : copyStatus === "error" ? "Unable to copy account number" : ""}
      </span>
      {copyStatus === "copied" ? <span className="text-xs font-medium text-emerald-700">Copied</span> : null}
    </div>
  );
}
