"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result = await signIn("credentials", {
      email: data.email.trim(),
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("root", {
        type: "manual",
        message: "Invalid email or password.",
      });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-slate-950 to-slate-950" />
          <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/BPI1.png"
                alt="BPI logo"
                width="50"
                height="50"
                className="border rounded-xl"
              />

              <span className="text-xl font-bold">BPI Bank</span>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Welcome back
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                Your finances,
                <span className="block text-blue-500">all in one place.</span>
              </h1>

              <p className="mt-6 max-w-md leading-7 text-slate-400">
                Access your accounts, manage transfers, track transactions, and stay in
                control of your finances.
              </p>

              <div className="mt-10 space-y-4">
                <Feature
                  icon={ShieldCheck}
                  title="Secure access"
                  description="Protected authentication and account access."
                />

                <Feature
                  icon={Wallet}
                  title="Simple banking"
                  description="Everything you need from one dashboard."
                />

                <Feature
                  icon={LockKeyhole}
                  title="Privacy focused"
                  description="Your financial information stays protected."
                />
              </div>
            </div>

            <p className="text-sm text-slate-600">© 2026 BPI Bank</p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-2 lg:hidden"
            >
              <Image
                src="/BPI1.png"
                alt="BPI logo"
                width="50"
                height="50"
                className="border rounded-xl"
              />

              <span className="text-xl font-bold">BPI Bank</span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
              <p className="mt-2 text-slate-400">
                Sign in to access your BPI Bank account.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />

                {errors.email ? (
                  <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />

                {errors.password ? (
                  <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-blue-600"
                  {...register("remember")}
                />

                <label htmlFor="remember" className="text-sm text-slate-400">
                  Keep me signed in
                </label>
              </div>

              {errors.root ? (
                <p className="text-sm text-red-500">{errors.root.message}</p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account? {" "}
              <Link
                href="/register"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Create one
              </Link>
            </p>

            <p className="mt-10 text-center text-xs leading-5 text-slate-600">
              Experience a modern banking with BPI Bank
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>

      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}