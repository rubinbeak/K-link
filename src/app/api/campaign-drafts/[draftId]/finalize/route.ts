import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { calculateSchedule, estimatePricing } from "@/lib/visit-campaign";
import { toInvoiceNumber } from "@/lib/invoice";
import {
  finalizeFunnelDraftTransaction,
  isFunnelDraftData,
  type FunnelDraftPayload,
} from "@/lib/funnel-campaign-finalize";

type DraftData = {
  step1?: {
    campaignName?: string;
    placeType?: string;
    visitGoals?: string[];
  };
  step2?: {
    visitRegion?: string;
    address?: string;
    venueDescription?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    operationStartTime?: string;
    operationEndTime?: string;
    hasBenefits?: boolean;
    benefitTypes?: string[];
    productDescription?: string;
    productValueKrw?: number;
  };
  step3?: {
    targetRegions?: string[];
    genderTarget?: string;
    followerTier?: "LTE_5K" | "BETWEEN_5K_30K" | "GTE_30K";
    platforms?: string[];
    headcount?: number;
  };
};

export async function POST(_request: Request, { params }: { params: Promise<{ draftId: string }> }) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const { draftId } = await params;
  const draft = await prisma.campaignDraft.findUnique({ where: { id: draftId } });
  if (!draft || draft.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (draft.isFinalized) {
    return NextResponse.json({ error: "Already finalized" }, { status: 409 });
  }

  const rawData = draft.data as Record<string, unknown> | null;
  if (isFunnelDraftData(draft.data)) {
    const funnel: FunnelDraftPayload =
      rawData?.formKind === "funnel"
        ? (draft.data as FunnelDraftPayload)
        : ({
            formKind: "funnel",
            step1: rawData?.step1,
            step2: rawData?.step2,
            step3: rawData?.step3,
          } as FunnelDraftPayload);

    try {
      const result = await prisma.$transaction((tx) =>
        finalizeFunnelDraftTransaction(tx, {
          brandId: authResult.session.user.id,
          draftId: draft.id,
          funnel,
        }),
      );
      const totalPrice = result.payment.amount;
      return NextResponse.json({
        campaignId: result.campaign.id,
        paymentId: result.payment.id,
        status: "READY_FOR_PAYMENT",
        totalPrice,
        invoiceNumber: toInvoiceNumber(result.payment.id, result.payment.createdAt),
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "캠페인 생성 실패";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  const data = (draft.data as DraftData) ?? {};
  const step1 = data.step1 ?? {};
  const step2 = data.step2 ?? {};
  const step3 = data.step3 ?? {};

  if (
    !step1.campaignName ||
    !step1.placeType ||
    !step2.visitRegion ||
    !step2.address ||
    !step2.eventStartDate ||
    !step2.operationStartTime ||
    !step2.operationEndTime ||
    !step3.followerTier ||
    !step3.genderTarget ||
    !step3.platforms?.length ||
    !step3.targetRegions?.length
  ) {
    return NextResponse.json({ error: "Draft is incomplete" }, { status: 400 });
  }

  const headcount = Math.max(1, step3.headcount ?? 1);
  const campaignName = step1.campaignName;
  const placeType = step1.placeType;
  const visitRegion = step2.visitRegion;
  const address = step2.address;
  const eventStartDate = step2.eventStartDate;
  const operationStartTime = step2.operationStartTime;
  const operationEndTime = step2.operationEndTime;
  const followerTier = step3.followerTier;
  const genderTarget = step3.genderTarget;
  const platforms = step3.platforms;
  const targetRegions = step3.targetRegions;

  if (
    !campaignName ||
    !placeType ||
    !visitRegion ||
    !address ||
    !eventStartDate ||
    !operationStartTime ||
    !operationEndTime ||
    !followerTier ||
    !genderTarget ||
    !platforms?.length ||
    !targetRegions?.length
  ) {
    return NextResponse.json({ error: "Draft is incomplete" }, { status: 400 });
  }

  const pricing = estimatePricing({ followerTier, headcount });
  const visitStartDate = new Date(eventStartDate);
  const schedule = calculateSchedule(visitStartDate);

  const result = await prisma.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        brandId: authResult.session.user.id,
        title: campaignName,
        description: step2.venueDescription ?? "방문형 콘텐츠 캠페인",
        budget: pricing.totalPrice,
        status: "OPEN",
        campaignType: "VISIT_CONTENT",
        lifecycle: "READY_FOR_PAYMENT",
      },
    });

    const visit = await tx.visitCampaignDetail.create({
      data: {
        campaignId: campaign.id,
        placeType: placeType as never,
        visitGoals: (step1.visitGoals ?? ["OTHER"]) as never,
        visitRegion: visitRegion as never,
        address,
        venueDescription: step2.venueDescription,
        eventStartDate: visitStartDate,
        eventEndDate: step2.eventEndDate ? new Date(step2.eventEndDate) : null,
        operationStartTime,
        operationEndTime,
        hasBenefits: Boolean(step2.hasBenefits),
      },
    });

    if (step2.hasBenefits && step2.benefitTypes?.length) {
      await tx.visitBenefit.createMany({
        data: step2.benefitTypes.map((type) => ({
          visitCampaignId: visit.id,
          type: type as never,
          productDescription: type === "PRODUCT" ? step2.productDescription : null,
          productValueKrw: type === "PRODUCT" ? step2.productValueKrw ?? null : null,
        })),
      });
    }

    await tx.influencerRequirement.create({
      data: {
        campaignId: campaign.id,
        targetRegions: targetRegions as never,
        genderTarget: genderTarget as never,
        followerTier: followerTier as never,
        headcount,
        platforms: platforms as never,
      },
    });

    await tx.pricingSnapshot.create({
      data: {
        campaignId: campaign.id,
        basePriceKrw: pricing.basePrice,
        followerSurchargeKrw: pricing.followerSurcharge,
        unitPriceKrw: pricing.unitPrice,
        headcount,
        totalPriceKrw: pricing.totalPrice,
        currency: pricing.currency,
      },
    });

    await tx.schedulePlan.create({
      data: {
        campaignId: campaign.id,
        guidelineConfirmBy: schedule.guidelineConfirmBy,
        influencerListDelivery: schedule.influencerListDeliveryDate,
        visitStartDate: schedule.visitStartDate,
        uploadDueDate: schedule.uploadDueDate,
        reportDueDate: schedule.reportDueDate,
      },
    });

    const payment = await tx.payment.create({
      data: {
        brandId: authResult.session.user.id,
        campaignId: campaign.id,
        amount: pricing.totalPrice,
        status: "PENDING",
      },
    });

    await tx.campaignDraft.update({
      where: { id: draft.id },
      data: { isFinalized: true },
    });

    return { campaign, payment };
  });

  return NextResponse.json({
    campaignId: result.campaign.id,
    paymentId: result.payment.id,
    status: "READY_FOR_PAYMENT",
    totalPrice: pricing.totalPrice,
    invoiceNumber: toInvoiceNumber(result.payment.id, result.payment.createdAt),
  });
}
