"use client";

import {
  Bell,
  CheckCircle2,
  ChevronRight,
  LogOut,
  UserRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { TransactionPinForm } from "@/components/dashboard/transactionPinForm";
import { ProfileForm } from "@/components/dashboard/profileForm";
import { useTRPC } from "@/trpc";

export default function SettingsPage() {
  const trpc = useTRPC();
  const profileQuery = useQuery(trpc.user.me.queryOptions());
  const profileName = profileQuery.data?.name?.trim() || "Your profile";
  const initials = getInitials(profileName);

  return (
    <main className="min-h-full px-5 py-8 text-stone-900 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl pb-6">
        <header className="border-b border-stone-200 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-red)">
                Account control
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Settings
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
                Keep your banking profile secure and choose how you stay informed.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:self-auto">
              <CheckCircle2 className="h-4 w-4" />
              Account protected
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-5">
            <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--brand-gold) text-lg font-semibold text-(--brand-red-dark)">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
                    Personal account
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-stone-900">
                    Your profile
                  </h2>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-stone-500">
                <UserRound className="h-4 w-4 text-stone-400" />
                Keep your details current for transfers and account records.
              </div>
            </section>

            <section className="rounded-md border border-red-200 bg-red-50 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-(--brand-red)">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Security center</h2>
              <p className="mt-2 text-sm leading-5 text-red-900/65">
                Your transaction PIN adds an extra layer of protection whenever money moves out of your account.
              </p>

              <div className="mt-4 flex items-center gap-3 border-t border-red-200 pt-4">
                <LockKeyhole className="h-4 w-4 text-(--brand-red)" />
                <span className="text-sm text-red-900/80">Transaction approval enabled</span>
              </div>
            </section>

            <section className="rounded-md border border-red-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-(--brand-red)">
                  <LogOut className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Sign out</h2>
                  <p className="mt-1 text-xs text-stone-500">End this session on the current device.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </section>

            <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100 text-stone-600">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Notifications</h2>
                  <p className="mt-1 text-xs text-stone-500">Stay up to date with account activity.</p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-stone-100 border-y border-stone-100">
                <PreferenceRow label="Transaction alerts" detail="Coming soon" />
                <PreferenceRow label="Security updates" detail="Always on" active />
              </div>
            </section>
          </div>

          <section>
            <div>
              <p className="text-sm font-semibold text-stone-900">Profile and security</p>
              <p className="mt-1 text-sm text-stone-500">Manage your personal details and transfer protection.</p>
            </div>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <ProfileForm />
              <TransactionPinForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function getInitials(name: string) {
  const nameWords = name.split(/\s+/).filter(Boolean);

  if (nameWords.length < 2) {
    return nameWords[0]?.slice(0, 2).toUpperCase() || "YP";
  }

  return `${nameWords[0][0]}${nameWords[1][0]}`.toUpperCase();
}

function PreferenceRow({
  label,
  detail,
  active = false,
}: {
  label: string;
  detail: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-stone-900">{label}</p>
        <p className="mt-1 text-xs text-stone-500">{detail}</p>
      </div>
      {active ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </span>
      ) : (
        <ChevronRight className="h-4 w-4 text-stone-400" />
      )}
    </div>
  );
}