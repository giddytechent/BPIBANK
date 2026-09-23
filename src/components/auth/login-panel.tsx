import { AuthPanel, AuthPanelFeature } from "@/components/auth/auth-panel";
import { loginFeatures, loginPanelCopy } from "@/components/auth/auth-copy";

export function LoginPanel() {
  return (
    <AuthPanel {...loginPanelCopy}>
      {loginFeatures.map((feature) => (
        <AuthPanelFeature key={feature.title} {...feature} />
      ))}
    </AuthPanel>
  );
}
