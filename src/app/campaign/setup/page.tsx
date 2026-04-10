import { redirect } from "next/navigation";
import { CampaignSetupFunnelForm } from "@/components/campaign/campaign-setup-funnel-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userToBrandContactStep1 } from "@/lib/brand-profile";

export default async function CampaignSetupPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/campaign/setup");
  }
  if (session.user.role !== "BRAND") {
    redirect("/auth/redirect");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { brandName: true, name: true, email: true, contactPhoneE164: true },
  });
  const initialBrandProfile = userToBrandContactStep1(
    user ?? {
      brandName: null,
      name: null,
      email: session.user.email ?? "",
      contactPhoneE164: null,
    },
  );

  return <CampaignSetupFunnelForm initialBrandProfile={initialBrandProfile} />;
}
