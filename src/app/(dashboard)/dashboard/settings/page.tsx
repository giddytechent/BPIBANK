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
    <main className="h-dvh overflow-y-auto bg-slate-950 px-5 py-6 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl pb-6">
        <header className="border-b border-white/10 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
                Account control
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Settings
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Keep your banking profile secure and choose how you stay informed.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300 sm:self-auto">
              <CheckCircle2 className="h-4 w-4" />
              Account protected
            </div>
          </div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-lg font-semibold text-blue-300">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    Personal account
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-100">
                    Your profile
                  </h2>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                <UserRound className="h-4 w-4 text-slate-500" />
                Keep your details current for transfers and account records.
              </div>
            </section>

            <section className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-400/15 text-blue-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Security center</h2>
              <p className="mt-2 text-sm leading-5 text-blue-100/65">
                Your transaction PIN adds an extra layer of protection whenever money moves out of your account.
              </p>

              <div className="mt-4 flex items-center gap-3 border-t border-blue-300/15 pt-4">
                <LockKeyhole className="h-4 w-4 text-blue-300" />
                <span className="text-sm text-blue-100/80">Transaction approval enabled</span>
              </div>
            </section>

            <section className="rounded-2xl border border-red-400/20 bg-red-500/5 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  <LogOut className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Sign out</h2>
                  <p className="mt-1 text-xs text-slate-500">End this session on the current device.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-400/25 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-semibold">Notifications</h2>
                  <p className="mt-1 text-xs text-slate-500">Stay up to date with account activity.</p>
                </div>
              </div>

              <div className="mt-4 divide-y divide-white/5 border-y border-white/5">
                <PreferenceRow label="Transaction alerts" detail="Coming soon" />
                <PreferenceRow label="Security updates" detail="Always on" active />
              </div>
            </section>
          </div>

          <section>
            <div>
              <p className="text-sm font-medium text-slate-200">Profile and security</p>
              <p className="mt-1 text-sm text-slate-500">Manage your personal details and transfer protection.</p>
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
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{detail}</p>
      </div>
      {active ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </span>
      ) : (
        <ChevronRight className="h-4 w-4 text-slate-600" />
      )}
    </div>
  );
}