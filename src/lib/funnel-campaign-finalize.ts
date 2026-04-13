import { calculateSchedule } from "@/lib/visit-campaign";
import type { PrismaClient } from "@/generated/prisma";

/** 퍼널 폼(`CampaignSetupFunnelForm`)이 API에 저장하는 JSON 구조 */
export type FunnelDraftPayload = {
  formKind: "funnel";
  step1: {
    contactBrandName: string;
    contactManagerProfile: string;
    contactEmail: string;
    contactPhone: string;
    campaignName: string;
    placeType: string;
    placeTypeCustom: string;
    visitPurposes: string[];
  };
  step2: {
    draftPlace: {
      visitCountry: string;
      address: string;
      placeDescription: string;
      eventStartDate: string;
      eventEndDate: string;
      operationStartTime: string;
      operationEndTime: string;
    };
    places: Array<{
      visitCountry: string;
      address: string;
      placeDescription: string;
      eventStartDate: string;
      eventEndDate: string;
      operationStartTime: string;
      operationEndTime: string;
    }>;
    hasBenefits: "YES" | "NO";
    benefitTypes: string[];
    benefitOtherText: string;
    productDetails: string;
    productEstimatedValue: string;
  };
  step3: {
    targetCountries: string[];
    followerCountUnder5k: number;
    followerCountOver5k: number;
    extraRequests: string;
    platforms: string[];
  };
};

const UNIT_UNDER = 250_000;
const UNIT_OVER = 500_000;

const PURPOSE_TO_GOAL: Record<string, string> = {
  "팝업스토어 소개": "INTRO_EVENT",
  "팝업스토어 및 행사 부스 소개": "INTRO_EVENT",
  "매장 소개 및 홍보": "INTRO_STORE",
  "제품 체험 및 홍보": "PRODUCT_TRY_PROMO",
  "브랜드 체험": "BRAND_EXPERIENCE",
  "이벤트 참여": "EVENT_PARTICIPATION",
  "인터뷰 진행": "INTERVIEW",
  "신규 오픈 홍보": "NEW_OPEN_PROMO",
  "할인 / 이벤트 홍보": "DISCOUNT_PROMO",
  기타: "OTHER",
  "외국 신환 유치": "OTHER",
  "병원 오픈 소개": "NEW_OPEN_PROMO",
  "시설 및 시술 홍보": "PRODUCT_TRY_PROMO",
  "병원 인터뷰": "INTERVIEW",
};

export function isFunnelDraftData(raw: unknown): raw is FunnelDraftPayload {
  if (!raw || typeof raw !== "object") return false;
  const d = raw as Record<string, unknown>;
  if (d.formKind === "funnel") return true;
  const s1 = d.step1 as Record<string, unknown> | undefined;
  return Boolean(s1 && typeof s1.contactBrandName === "string");
}

export type FunnelPlaceRow = FunnelDraftPayload["step2"]["places"][number];

/** 방문 1건으로 인정되는지(기본 입력란 또는 추가된 행 공통) */
export function isValidFunnelPlaceRow(p: FunnelPlaceRow): boolean {
  return Boolean(
    p.visitCountry &&
      p.address &&
      p.eventStartDate &&
      p.eventEndDate &&
      p.operationStartTime &&
      p.operationEndTime &&
      p.eventEndDate >= p.eventStartDate &&
      p.operationEndTime > p.operationStartTime,
  );
}

/**
 * 확정된 `places` + (필드가 모두 채워진) 기본 입력란 `draftPlace`.
 * 「추가하기」 없이도 draft만으로 1건 방문이 인정됩니다.
 */
export function effectiveFunnelPlaces(step2: FunnelDraftPayload["step2"]): FunnelPlaceRow[] {
  const out: FunnelPlaceRow[] = [...step2.places];
  const d = step2.draftPlace;
  if (isValidFunnelPlaceRow(d)) {
    out.push({ ...d });
  }
  return out;
}

export function validateFunnelDraft(f: FunnelDraftPayload): string | null {
  const { step1, step2, step3 } = f;
  if (!step1.placeType) return "방문 장소 유형을 선택해 주세요.";
  if (step1.placeType === "OTHER" && !step1.placeTypeCustom?.trim()) return "기타 장소 유형을 입력해 주세요.";
  if (!step1.visitPurposes?.length) return "방문/콘텐츠 목적을 1개 이상 선택해 주세요.";
  const venueRows = effectiveFunnelPlaces(step2);
  if (!venueRows.length) {
    return "방문 지역·주소·일정·운영 시간을 모두 입력해 주세요. (여러 장소는 추가하기로 더 넣을 수 있습니다.)";
  }
  for (const p of venueRows) {
    if (!isValidFunnelPlaceRow(p)) {
      return "방문 장소의 일정·시간 정보를 모두 올바르게 입력해 주세요.";
    }
  }
  if (!step3.targetCountries?.length) return "타겟 국가를 1개 이상 선택해 주세요.";
  if (!step3.platforms?.length) return "업로드 플랫폼을 1개 이상 선택해 주세요.";
  const headcount = Math.max(0, step3.followerCountUnder5k) + Math.max(0, step3.followerCountOver5k);
  if (headcount < 1) return "인플루언서 인원(5000 미만/이상)을 합쳐 1명 이상 입력해 주세요.";
  return null;
}

function visitGoalsFromPurposes(purposes: string[]): string[] {
  const mapped = purposes.map((p) => PURPOSE_TO_GOAL[p] ?? "OTHER");
  return [...new Set(mapped)];
}

function followerTierForFunnel(under: number, over: number): string {
  if (over > 0 && under > 0) return "BETWEEN_5K_30K";
  if (over > 0) return "BETWEEN_5K_30K";
  return "LTE_5K";
}

function funnelPricing(under: number, over: number) {
  const underCount = Math.max(0, under);
  const overCount = Math.max(0, over);
  const subtotal = underCount * UNIT_UNDER + overCount * UNIT_OVER;
  const vat = Math.round(subtotal * 0.1);
  const totalWithVat = subtotal + vat;
  const headcount = underCount + overCount;
  const unitPreTax = Math.round(subtotal / headcount);
  const followerSurcharge = Math.max(0, unitPreTax - UNIT_UNDER);
  return {
    underCount,
    overCount,
    headcount,
    subtotal,
    vat,
    totalWithVat,
    unitPreTax,
    followerSurcharge,
  };
}

function buildDescription(f: FunnelDraftPayload, extraVenueNotes: string): string {
  const lines = [
    f.step1.campaignName?.trim() ? `캠페인명: ${f.step1.campaignName.trim()}` : null,
    f.step1.placeType === "OTHER" && f.step1.placeTypeCustom?.trim()
      ? `장소 유형(기타): ${f.step1.placeTypeCustom.trim()}`
      : null,
    `담당: ${f.step1.contactManagerProfile} / ${f.step1.contactEmail} / ${f.step1.contactPhone}`,
    `브랜드: ${f.step1.contactBrandName}`,
    f.step3.extraRequests?.trim() ? `추가 요청:\n${f.step3.extraRequests.trim()}` : null,
    extraVenueNotes || null,
  ];
  return lines.filter(Boolean).join("\n\n") || "방문형 콘텐츠 캠페인";
}

export async function finalizeFunnelDraftTransaction(
  tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends">,
  input: { brandId: string; draftId: string; funnel: FunnelDraftPayload },
) {
  const err = validateFunnelDraft(input.funnel);
  if (err) throw new Error(err);

  const f = input.funnel;
  const venueRows = effectiveFunnelPlaces(f.step2);
  const primary = venueRows[0]!;
  const restPlaces = venueRows.slice(1);
  const extraVenue =
    restPlaces.length > 0
      ? `[추가 방문지]\n${restPlaces
          .map(
            (p, i) =>
              `${i + 2}. ${p.visitCountry} ${p.address} (${p.eventStartDate}~${p.eventEndDate}, ${p.operationStartTime}-${p.operationEndTime})${p.placeDescription ? `\n   ${p.placeDescription}` : ""}`,
          )
          .join("\n")}`
      : "";

  const placeType = f.step1.placeType === "OTHER" ? "OTHER" : f.step1.placeType;
  const title =
    f.step1.campaignName?.trim() ||
    `${f.step1.contactBrandName.trim() || "브랜드"} 방문형 콘텐츠 캠페인`;

  const visitGoals = visitGoalsFromPurposes(f.step1.visitPurposes);
  const pricing = funnelPricing(f.step3.followerCountUnder5k, f.step3.followerCountOver5k);
  const followerTier = followerTierForFunnel(pricing.underCount, pricing.overCount);

  const venueDescription = [primary.placeDescription?.trim(), extraVenue || undefined].filter(Boolean).join("\n\n");
  const description = buildDescription(f, venueDescription);

  const visitStartDate = new Date(primary.eventStartDate);
  const schedule = calculateSchedule(visitStartDate);

  const campaign = await tx.campaign.create({
    data: {
      brandId: input.brandId,
      title,
      description,
      budget: pricing.totalWithVat,
      status: "OPEN",
      campaignType: "VISIT_CONTENT",
      lifecycle: "READY_FOR_PAYMENT",
    },
  });

  const visit = await tx.visitCampaignDetail.create({
    data: {
      campaignId: campaign.id,
      placeType: placeType as never,
      visitGoals: visitGoals as never,
      visitRegion: primary.visitCountry as never,
      address: primary.address,
      venueDescription: venueDescription || null,
      eventStartDate: visitStartDate,
      eventEndDate: primary.eventEndDate ? new Date(primary.eventEndDate) : null,
      operationStartTime: primary.operationStartTime,
      operationEndTime: primary.operationEndTime,
      hasBenefits: f.step2.hasBenefits === "YES",
    },
  });

  if (f.step2.hasBenefits === "YES" && f.step2.benefitTypes.length > 0) {
    await tx.visitBenefit.createMany({
      data: f.step2.benefitTypes.map((type) => ({
        visitCampaignId: visit.id,
        type: type as never,
        productDescription:
          type === "PRODUCT"
            ? f.step2.productDetails || null
            : type === "OTHER"
              ? f.step2.benefitOtherText || null
              : null,
        productValueKrw:
          type === "PRODUCT" && f.step2.productEstimatedValue
            ? Number.parseInt(f.step2.productEstimatedValue, 10) || null
            : null,
      })),
    });
  }

  await tx.influencerRequirement.create({
    data: {
      campaignId: campaign.id,
      targetRegions: f.step3.targetCountries as never,
      genderTarget: "ANY" as never,
      followerTier: followerTier as never,
      headcount: pricing.headcount,
      platforms: f.step3.platforms as never,
    },
  });

  await tx.pricingSnapshot.create({
    data: {
      campaignId: campaign.id,
      basePriceKrw: UNIT_UNDER,
      followerSurchargeKrw: pricing.followerSurcharge,
      unitPriceKrw: pricing.unitPreTax,
      headcount: pricing.headcount,
      totalPriceKrw: Math.round(pricing.totalWithVat),
      currency: "KRW",
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
      brandId: input.brandId,
      campaignId: campaign.id,
      amount: pricing.totalWithVat,
      status: "PENDING",
    },
  });

  await tx.campaignDraft.update({
    where: { id: input.draftId },
    data: { isFinalized: true },
  });

  return { campaign, payment };
}
