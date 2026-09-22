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
      <div className="rounded-md border border-stone-200 bg-white p-5 text-sm text-stone-500 shadow-sm">
        Loading security settings...
      </div>
    );
  }

  const hasPin = pinQuery.data?.hasPin;

  return (
    <div className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-(--brand-gold) text-(--brand-red-dark)">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Transaction PIN</h2>
          <p className="mt-1 text-sm leading-5 text-stone-500">
            A 6-digit PIN protects transfers from your account.
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Status</p>
          <p className="mt-1 font-medium text-stone-900">{hasPin ? "Active" : "Not set"}</p>
        </div>
        {hasPin && <CheckCircle2 className="h-5 w-5 text-emerald-700" />}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 space-y-4"
      >
        <div>
          <label
            htmlFor="transaction-pin"
            className="mb-2 block text-sm font-medium text-stone-700"
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
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-(--brand-red) focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-transaction-pin"
            className="mb-2 block text-sm font-medium text-stone-700"
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
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-(--brand-red) focus:ring-2 focus:ring-red-100"
          />
        </div>

        {message && (
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={setPinMutation.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-(--brand-red) px-4 py-2.5 font-medium text-white transition hover:bg-(--brand-red-dark) disabled:cursor-not-allowed disabled:opacity-50"
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