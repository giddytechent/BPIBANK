import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import {
  authErrorClassName,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-styles";

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
  labelAction?: ReactNode;
  leadingIcon?: ReactNode;
  inputClassName?: string;
} & ComponentProps<"input">;

export function AuthField({
  id,
  label,
  error,
  labelAction,
  leadingIcon,
  inputClassName,
  className,
  ...inputProps
}: AuthFieldProps) {
  const hasLeadingIcon = Boolean(leadingIcon);

  return (
    <div className={className}>
      {labelAction ? (
        <div className="mb-2 flex items-center justify-between gap-3">
          <label htmlFor={id} className="text-sm font-medium text-stone-700">
            {label}
          </label>
          {labelAction}
        </div>
      ) : (
        <label htmlFor={id} className={authLabelClassName}>
          {label}
        </label>
      )}

      <div className={hasLeadingIcon ? "relative" : undefined}>
        {leadingIcon ? (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            {leadingIcon}
          </span>
        ) : null}

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          className={cn(authInputClassName, hasLeadingIcon && "pl-11", inputClassName)}
          {...inputProps}
        />
      </div>

      {error ? (
        <p className={authErrorClassName} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AuthCheckboxField({
  id,
  label,
  className,
  align = "start",
  labelClassName,
  ...inputProps
}: {
  id: string;
  label: ReactNode;
  align?: "start" | "center";
  labelClassName?: string;
} & ComponentProps<"input">) {
  return (
    <div
      className={cn(
        "flex gap-3",
        align === "center" ? "items-center" : "items-start",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-stone-300 accent-(--brand-red)",
          align === "start" && "mt-1",
        )}
        {...inputProps}
      />
      <label
        htmlFor={id}
        className={cn("text-xs leading-5 text-stone-500", labelClassName)}
      >
        {label}
      </label>
    </div>
  );
}

export function AuthRootError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className={authErrorClassName} role="alert">
      {message}
    </p>
  );
}
