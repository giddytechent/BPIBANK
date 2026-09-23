import Footer from "@/components/Footer";
import { AuthHeader } from "@/components/auth/auth-header";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
