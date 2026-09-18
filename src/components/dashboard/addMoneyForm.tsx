"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc";
import { queryClient } from "@/trpc/query-client";

export function AddMoneyForm({
    accountId,
}: {
    accountId: string;
}) {
    const trpc = useTRPC();

    const [amount, setAmount] = useState("");

    const depositMutation = useMutation(
        trpc.account.deposit.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries({
                    queryKey:
                        trpc.account.getById.queryKey({
                            id: accountId,
                        }),
                });

                await queryClient.invalidateQueries({
                    queryKey:
                        trpc.account.getMyAccounts.queryKey(),
                });

                setAmount("");
            },
        }),
    );

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        const Amount = Number(amount);

        if (
            !Number.isFinite(Amount) ||
            Amount <= 0
        ) {
            return;
        }

        const koboAmount = Math.round(
            Amount * 100,
        );

        try {
            await depositMutation.mutateAsync({
                accountId,
                amount: koboAmount,
            });
        } catch (error) {
            console.error(
                "Failed to add money:",
                error,
            );
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >
            <div>
                <label
                    htmlFor="amount"
                    className="mb-2 block text-sm font-medium text-slate-300"
                >
                    Amount
                </label>

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                    </span>

                    <input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(event) =>
                            setAmount(event.target.value)
                        }
                        placeholder="0.00"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-9 pr-4 text-white outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {depositMutation.isError && (
                <p className="text-sm text-red-400">
                    {depositMutation.error.message}
                </p>
            )}

            {depositMutation.isSuccess && (
                <p className="text-sm text-emerald-400">
                    Money added successfully.
                </p>
            )}

            <button
                type="submit"
                disabled={
                    depositMutation.isPending ||
                    !amount
                }
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {depositMutation.isPending
                    ? "Adding money..."
                    : "Add Money"}
            </button>
        </form>
    );
}