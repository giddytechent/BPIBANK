"use client";

import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { getSafeCallbackUrl } from "@/utils/get-safe-callback-url";
import {
  AuthCheckboxField,
  AuthField,
  AuthRootError,
} from "@/components/auth/auth-field";
import { AuthAlternateLink } from "@/components/auth/auth-form-extras";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthFormCard } from "@/components/auth/auth-shell";
import { authLinkClassName } from "@/components/auth/auth-styles";

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
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
      remember: data.remember ? "true" : "false",
      redirect: false,
    });

    if (result?.error) {
      setError("root", {
        type: "manual",
        message: "Invalid email or password.",
      });
      return;
    }

    const session = await getSession();
    if (!session?.user) {
      setError("root", {
        type: "manual",
        message: "You signed in, but your session could not be loaded. Please try again.",
      });
      return;
    }

    const destination = session.user.role === "ADMIN"
      ? callbackUrl.startsWith("/admin") ? callbackUrl : "/admin"
      : callbackUrl.startsWith("/admin") ? "/dashboard" : callbackUrl;

    router.replace(destination);
    router.refresh();
  };

  return (
    <AuthFormCard
      title="Welcome back"
      description="Sign in to access your BPI Bank account."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          labelAction={
            <Link href="/forgot-password" className={`text-sm ${authLinkClassName}`}>
              Forgot password?
            </Link>
          }
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        <AuthCheckboxField
          id="remember"
          label="Keep me signed in"
          align="center"
          labelClassName="text-sm text-stone-600"
          {...register("remember")}
        />

        <AuthRootError message={errors.root?.message} />

        <AuthSubmitButton loading={isSubmitting} loadingLabel="Signing in...">
          Sign in
        </AuthSubmitButton>
      </form>

      <AuthAlternateLink
        prompt="Don't have an account?"
        linkHref={
          callbackUrl === "/dashboard"
            ? "/register"
            : `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
        }
        linkLabel="Create one"
      />
    </AuthFormCard>
  );
}
