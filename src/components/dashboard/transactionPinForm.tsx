"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, Save } from "lucide-react";
import { useTRPC } from "@/trpc";

export function TransactionPinForm() {
  const trpc = useTRPC();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");

  const pinQuery = useQuery(
    trpc.user.hasTransactionPin.queryOptions(),
  );

  const setPinMutation = useMutation(
    trpc.user.setTransactionPin.mutationOptions(),
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    if (!/^\d{6}$/.test(pin)) {
      setMessage("PIN must be exactly 6 digits.");
      return;
    }

    if (pin !== confirmPin) {
      setMessage("PINs do not match.");
      return;
    }

    try {
      await setPinMutation.mutateAsync({
        pin,
      });

      setPin("");
      setConfirmPin("");

      setMessage("Transaction PIN saved successfully.");

      await pinQuery.refetch();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save transaction PIN.",
      );
    }
  };

  if (pinQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 text-sm text-slate-500">
        Loading security settings...
      </div>
    );
  }

  const hasPin = pinQuery.data?.hasPin;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-5 shadow-2xl shadow-black/10">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Transaction PIN</h2>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            A 6-digit PIN protects transfers from your account.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</p>
          <p className="mt-1 font-medium text-white">{hasPin ? "Active" : "Not set"}</p>
        </div>
        {hasPin && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-4"
      >
        <div>
          <label
            htmlFor="transaction-pin"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            {hasPin
              ? "New transaction PIN"
              : "Create transaction PIN"}
          </label>

          <input
            id="transaction-pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(event) =>
              setPin(
                event.target.value.replace(/\D/g, ""),
              )
            }
            placeholder="••••••"
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-transaction-pin"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Confirm transaction PIN
          </label>

          <input
            id="confirm-transaction-pin"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={confirmPin}
            onChange={(event) =>
              setConfirmPin(
                event.target.value.replace(/\D/g, ""),
              )
            }
            placeholder="••••••"
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
          />
        </div>

        {message && (
          <p className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2.5 text-sm text-emerald-300">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={setPinMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {setPinMutation.isPending
            ? "Saving..."
            : hasPin
              ? "Change PIN"
              : "Set Transaction PIN"}
        </button>
      </form>
    </div>
  );
}