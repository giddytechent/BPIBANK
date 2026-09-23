import { AuthPanel, AuthPanelBenefit } from "@/components/auth/auth-panel";
import { registerBenefits, registerPanelCopy } from "@/components/auth/auth-copy";

export function RegisterPanel() {
  return (
    <AuthPanel {...registerPanelCopy}>
      {registerBenefits.map((benefit) => (
        <AuthPanelBenefit key={benefit}>{benefit}</AuthPanelBenefit>
      ))}
    </AuthPanel>
  );
}
