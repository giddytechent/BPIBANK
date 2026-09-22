"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@/trpc";
import { queryClient } from "@/trpc/query-client";

export function CreateAccountForm() {
  const trpc = useTRPC();

  const [type, setType] = useState<
    "CHECKING" | "SAVINGS"
  >("SAVINGS");

  const createAccountMutation = useMutation(
    trpc.account.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey:
            trpc.account.getMyAccounts.queryKey(),
        });
      },
    }),
  );

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      await createAccountMutation.mutateAsync({
        type,
      });
    } catch (error) {
      console.error(
        "Failed to create account:",
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
          htmlFor="account-type"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Account type
        </label>

        <select
          id="account-type"
          value={type}
          onChange={(event) =>
            setType(
              event.target.value as
                | "CHECKING"
                | "SAVINGS",
            )
          }
          className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none focus:border-(--brand-red)"
        >
          <option value="SAVINGS">
            Savings Account
          </option>

          <option value="CHECKING">
            Checking Account
          </option>
        </select>
      </div>

      {createAccountMutation.isError && (
        <p className="text-sm text-red-700">
          {createAccountMutation.error.message}
        </p>
      )}

      {createAccountMutation.isSuccess && (
        <p className="text-sm text-emerald-700">
          Account created successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={createAccountMutation.isPending}
        className="w-full rounded-md bg-(--brand-red) px-4 py-3 font-medium text-white transition hover:bg-(--brand-red-dark) disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createAccountMutation.isPending
          ? "Creating..."
          : "Create Account"}
      </button>
    </form>
  );
}