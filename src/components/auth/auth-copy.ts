import type { ComponentType } from "react";
import { LockKeyhole, ShieldCheck, Wallet } from "lucide-react";

export const loginPanelCopy = {
  eyebrow: "Welcome back",
  title: "Your finances,",
  titleHighlight: "all in one place.",
  description:
    "Access your accounts, manage transfers, track transactions, and stay in control of your finances.",
} as const;

export const loginFeatures: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "Secure access",
    description: "Protected authentication and account access.",
  },
  {
    icon: Wallet,
    title: "Simple banking",
    description: "Everything you need from one dashboard.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy focused",
    description: "Your financial information stays protected.",
  },
];

export const registerPanelCopy = {
  eyebrow: "Get started",
  title: "A smarter way to",
  titleHighlight: "manage your money.",
  description:
    "Create your account and experience a modern banking interface designed around simplicity and control.",
} as const;

export const registerBenefits = [
  "Manage your accounts from one dashboard",
  "Send and receive money transfers",
  "Track your transaction history",
  "Manage virtual cards",
] as const;
