import { redirect } from "next/navigation";
import { CampaignSetupFunnelForm } from "@/components/campaign/campaign-setup-funnel-form";
import { auth } from "@/auth";

export default async function CampaignSetupPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/campaign/setup");
  }
  if (session.user.role !== "BRAND") {
    redirect("/auth/redirect");
  }

  return <CampaignSetupFunnelForm />;
}
