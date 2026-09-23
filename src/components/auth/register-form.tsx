"use client";

import { UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSafeCallbackUrl } from "@/utils/get-safe-callback-url";
import {
  AuthCheckboxField,
  AuthField,
  AuthRootError,
} from "@/components/auth/auth-field";
import { AuthAlternateLink, AuthSecurityNote } from "@/components/auth/auth-form-extras";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthFormCard } from "@/components/auth/auth-shell";

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const trpc = useTRPC();
  const registerMutation = useMutation(trpc.auth.register.mutationOptions());

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        remember: "true",
        redirect: false,
      });

      if (!signInResult?.ok) {
        setError("root", {
          type: "manual",
          message: "Registration succeeded, but automatic login failed",
        });
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  };

  const confirmPasswordError =
    errors.confirmPassword?.message ??
    (registerMutation.isError ? registerMutation.error.message : undefined);

  return (
    <AuthFormCard
      title="Create your account"
      description="Start your BPI Bank experience today."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <AuthField
          id="name"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="John Doe"
          error={errors.name?.message}
          leadingIcon={<UserRound className="h-4 w-4" />}
          {...register("name", {
            required: "Name is required",
          })}
        />

        <AuthField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
          })}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />

        <AuthField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          error={confirmPasswordError}
          {...register("confirmPassword", {
            required: "Please confirm your password",
          })}
        />

        <AuthCheckboxField
          id="terms"
          name="terms"
          required
          label={
            <>
              I agree to the BPI Bank terms of service and acknowledge that this is a
              portfolio banking simulator.
            </>
          }
        />

        <AuthRootError message={errors.root?.message} />

        <AuthSubmitButton
          loading={isSubmitting || registerMutation.isPending}
          loadingLabel="Creating account..."
        >
          Create account
        </AuthSubmitButton>
      </form>

      <AuthAlternateLink
        prompt="Already have an account?"
        linkHref={
          callbackUrl === "/dashboard"
            ? "/login"
            : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        }
        linkLabel="Sign in"
      />

      <AuthSecurityNote />
    </AuthFormCard>
  );
}
