import { ArrowRight } from "lucide-react";
import { authSubmitClassName } from "@/components/auth/auth-styles";

type AuthSubmitButtonProps = {
  children: string;
  loading?: boolean;
  loadingLabel: string;
  disabled?: boolean;
};

export function AuthSubmitButton({
  children,
  loading = false,
  loadingLabel,
  disabled = false,
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={authSubmitClassName}
    >
      {loading ? loadingLabel : children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
