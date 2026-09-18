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
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 text-sm text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-white/10 bg-white/4 p-5 shadow-2xl shadow-black/10"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
          <UserRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Profile details</h2>
          <p className="mt-1 text-sm leading-5 text-slate-400">
            Update the information used on your account.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="profile-name" className="mb-2 block text-sm font-medium text-slate-300">
            Full name
          </label>

          <input
            id="profile-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-city" className="mb-2 block text-sm font-medium text-slate-300">
              City
            </label>

            <input
              id="profile-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
            />
          </div>

          <div>
            <label htmlFor="profile-country" className="mb-2 block text-sm font-medium text-slate-300">
              Country
            </label>

            <input
              id="profile-country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/10"
            />
          </div>
        </div>
      </div>

      {message && (
        <p className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/10 px-3 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={updateProfileMutation.isPending}
        className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {updateProfileMutation.isPending
          ? "Saving..."
          : "Save Profile"}
      </button>
    </form>
  );
}