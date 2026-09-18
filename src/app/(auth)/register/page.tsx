"use client"
import Link from "next/link";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const benefits = [
  "Manage your accounts from one dashboard",
  "Send and receive money transfers",
  "Track your transaction history",
  "Manage virtual cards",
];


export default function RegisterPage() {
  const router = useRouter()
  const trpc = useTRPC()
  const registerMutation = useMutation(
    trpc.auth.register.mutationOptions(),
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match"
      })
      return
    }
    try {
      const result = await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password
      })
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if(!signInResult?.ok){
        setError("root", {
          type: "manual",
          message: "Registration succeeded, but automatic login failed"
        })
        return
      }
      router.push("/dashboard")
      router.refresh()
      console.log("Registered user:", result)
    } catch (error) {
      console.error("Registration failed:", error)
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Something went wrong."
      })
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left branding */}
        <section className="relative hidden overflow-hidden lg:flex lg:order-1">
          <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-slate-950 to-slate-950" />

          <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <Link href="/" className="flex items-center gap-2">
              {/* <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                B
              </div> */}
              <Image
                src="/BPI1.png"
                alt="BPI logo"
                width="50"
                height="50"
                className="border rounded-xl"
              />

              <span className="text-xl font-bold">
                BPI Bank
              </span>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Get started
              </p>

              <h1 className="text-5xl font-bold leading-tight">
                A smarter way to
                <span className="block text-blue-500">
                  manage your money.
                </span>
              </h1>

              <p className="mt-6 leading-7 text-slate-400">
                Create your account and experience a modern banking
                interface designed around simplicity and control.
              </p>

              <div className="mt-10 space-y-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10">
                      <Check className="h-3.5 w-3.5 text-blue-400" />
                    </div>

                    <span className="text-sm text-slate-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-600">
              © 2026 BPI Bank
            </p>
          </div>
        </section>

        {/* Register form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:order-2">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
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

              <span className="text-xl font-bold">
                BPI Bank
              </span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Create your account
              </h2>

              <p className="mt-2 text-slate-400">
                Start your BPI Bank experience today.
              </p>
            </div>

            <form className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <div className="relative">
                  <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                  <input
                    id="name"
                    type="text"
                    {...register("name", {
                      required: "Name is required"
                    })}
                    autoComplete="name"
                    placeholder="John Doe"
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
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
                  {...register("email", {
                    required: "Email is required"
                  })}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.password && (
                  <p>{errors.password.message}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password"
                  })}
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword.message}</p>
                )}
                {registerMutation.isError && (
                  <p>{registerMutation.error.message}</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-blue-600"
                  required
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-slate-500"
                >
                  I agree to the BPIBank terms of service and
                  acknowledge that this is a portfolio banking
                  simulator.
                </label>
              </div>
                {errors.root && (
                  <p className="text-sm text-red-500">
                    {errors.root.message}
                  </p>
                )}
              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || registerMutation.isPending}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold transition hover:bg-blue-500"
              >
                {registerMutation.isPending ? "Creating account..." : "Create account"}

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            {/* Login */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>

            {/* Security note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Protected account access</span>
              <LockKeyhole className="ml-2 h-4 w-4" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}