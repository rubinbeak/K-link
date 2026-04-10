import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CampaignSetupFunnelForm } from "@/components/campaign/campaign-setup-funnel-form";
import { CampaignSetupWizard, type CampaignDraftData } from "@/components/campaign/campaign-setup-wizard";
import { isFunnelDraftData } from "@/lib/funnel-campaign-finalize";
import { userToBrandContactStep1 } from "@/lib/brand-profile";
export default async function CampaignSetupEditPage({ params }: { params: Promise<{ draftId: string }> }) {
  const { draftId } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(`/campaign/setup/${draftId}`)}`);
  if (session.user.role !== "BRAND") redirect("/auth/redirect");

  const draft = await prisma.campaignDraft.findUnique({ where: { id: draftId } });
  if (!draft || draft.brandId !== session.user.id) redirect("/campaign/setup");

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

  const useFunnel = isFunnelDraftData(draft.data);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-6xl px-4 py-10">
        <Link href="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← 브랜드 페이지
        </Link>
        {useFunnel ? (
          <CampaignSetupFunnelForm
            initialDraftId={draft.id}
            initialDraftData={draft.data}
            initialStep={draft.currentStep}
            initialBrandProfile={initialBrandProfile}
          />
        ) : (
          <CampaignSetupWizard initialDraftId={draft.id} initialData={draft.data as Partial<CampaignDraftData>} />
        )}
      </main>
    </div>
  );
}
