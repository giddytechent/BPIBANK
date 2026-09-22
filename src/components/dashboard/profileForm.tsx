"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2, Save, UserRound } from "lucide-react";
import { useTRPC } from "@/trpc";

export function ProfileForm() {
  const trpc = useTRPC();

  const profileQuery = useQuery(
    trpc.user.me.queryOptions(),
  );

  const updateProfileMutation = useMutation(
    trpc.user.updateProfile.mutationOptions(),
  );

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profileQuery.data) {
      setName(profileQuery.data.name ?? "");
      setCity(profileQuery.data.city ?? "");
      setCountry(profileQuery.data.country ?? "");
    }
  }, [profileQuery.data]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");

    try {
      await updateProfileMutation.mutateAsync({
        name,
        city,
        country,
      });

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update profile.",
      );
    }
  };

  if (profileQuery.isLoading) {
    return (
      <div className="rounded-md border border-stone-200 bg-white p-6 text-sm text-stone-500 shadow-sm">
        Loading profile...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-md border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-(--brand-red)">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Profile details</h2>
          <p className="mt-1 text-sm leading-5 text-stone-500">
            Update the information used on your account.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-stone-700">
            Full name
          </label>

          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-(--brand-red) focus:ring-2 focus:ring-red-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-city" className="mb-2 block text-sm font-medium text-stone-700">
              City
            </label>

            <input
              id="profile-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-(--brand-red) focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label htmlFor="profile-country" className="mb-2 block text-sm font-medium text-stone-700">
              Country
            </label>

            <input
              id="profile-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-(--brand-red) focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>
      </div>

      {message && (
        <p className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={updateProfileMutation.isPending}
        className="inline-flex items-center gap-2 rounded-md bg-(--brand-red) px-4 py-2.5 font-medium text-white transition hover:bg-(--brand-red-dark) disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {updateProfileMutation.isPending
          ? "Saving..."
          : "Save Profile"}
      </button>
    </form>
  );
}