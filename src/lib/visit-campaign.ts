import { addDays, subDays } from "date-fns";
import { z } from "zod";

export const PLACE_TYPE_VALUES = [
  "BEAUTY_STORE",
  "SHOPPING_MALL",
  "POPUP_STORE",
  "EVENT_BOOTH",
  "CLINIC",
  "FASHION_SHOWROOM",
  "EXPO",
  "RESTAURANT_FNB",
  "OTHER",
] as const;

export const VISIT_GOAL_VALUES = [
  "INTRO_EVENT",
  "INTRO_STORE",
  "PRODUCT_TRY_PROMO",
  "BRAND_EXPERIENCE",
  "EVENT_PARTICIPATION",
  "INTERVIEW",
  "NEW_OPEN_PROMO",
  "DISCOUNT_PROMO",
  "OTHER",
] as const;

export const REGION_VALUES = ["KR", "US", "JP", "CN", "EU", "ME", "SEA", "OTHER"] as const;
export const BENEFIT_VALUES = ["PRODUCT", "EXPERIENCE", "MEAL", "OTHER"] as const;
export const GENDER_VALUES = ["FEMALE", "MALE", "ANY"] as const;
export const FOLLOWER_TIER_VALUES = ["LTE_5K", "BETWEEN_5K_30K", "GTE_30K"] as const;
export const PLATFORM_VALUES = [
  "TIKTOK",
  "INSTAGRAM",
  "XIAOHONGSHU",
  "DOUYIN",
  "X_TWITTER",
  "OTHER",
] as const;

export const placeTypeLabel: Record<(typeof PLACE_TYPE_VALUES)[number], string> = {
  BEAUTY_STORE: "뷰티 매장",
  SHOPPING_MALL: "쇼핑몰",
  POPUP_STORE: "팝업스토어",
  EVENT_BOOTH: "축제 / 행사 부스",
  CLINIC: "병원 / 클리닉",
  FASHION_SHOWROOM: "패션 매장 / 쇼룸",
  EXPO: "전시 / 박람회",
  RESTAURANT_FNB: "레스토랑 / F&B",
  OTHER: "기타",
};

export const visitGoalLabel: Record<(typeof VISIT_GOAL_VALUES)[number], string> = {
  INTRO_EVENT: "팝업스토어 및 행사 부스 소개",
  INTRO_STORE: "매장 소개",
  PRODUCT_TRY_PROMO: "제품 체험 및 홍보",
  BRAND_EXPERIENCE: "브랜드 체험",
  EVENT_PARTICIPATION: "이벤트 참여",
  INTERVIEW: "인터뷰 진행",
  NEW_OPEN_PROMO: "신규 오픈 홍보",
  DISCOUNT_PROMO: "할인 / 이벤트 홍보",
  OTHER: "기타",
};

export const regionLabel: Record<(typeof REGION_VALUES)[number], string> = {
  KR: "한국",
  US: "미국",
  JP: "일본",
  CN: "중국",
  EU: "유럽",
  ME: "중동",
  SEA: "동남아",
  OTHER: "기타",
};

export const benefitLabel: Record<(typeof BENEFIT_VALUES)[number], string> = {
  PRODUCT: "제품 제공",
  EXPERIENCE: "체험 제공",
  MEAL: "식사 제공",
  OTHER: "기타",
};

export const genderLabel: Record<(typeof GENDER_VALUES)[number], string> = {
  FEMALE: "여성",
  MALE: "남성",
  ANY: "상관없음",
};

export const followerTierLabel: Record<(typeof FOLLOWER_TIER_VALUES)[number], string> = {
  LTE_5K: "5천 이하",
  BETWEEN_5K_30K: "5천 ~ 3만",
  GTE_30K: "3만 이상",
};

export const platformLabel: Record<(typeof PLATFORM_VALUES)[number], string> = {
  TIKTOK: "TikTok",
  INSTAGRAM: "Instagram",
  XIAOHONGSHU: "샤오홍슈",
  DOUYIN: "도우인",
  X_TWITTER: "트위터(X)",
  OTHER: "기타",
};

/** 기본 25만원 기준 팔로워 구간 추가금 (5천 초과 구간은 +20만 → 인당 45만) */
const moneyByFollowerTier: Record<(typeof FOLLOWER_TIER_VALUES)[number], number> = {
  LTE_5K: 0,
  BETWEEN_5K_30K: 200000,
  GTE_30K: 200000,
};

export function estimatePricing(input: { headcount: number; followerTier: (typeof FOLLOWER_TIER_VALUES)[number] }) {
  const basePrice = 250000;
  const followerSurcharge = moneyByFollowerTier[input.followerTier] ?? 0;
  const unitPrice = basePrice + followerSurcharge;
  const totalPrice = unitPrice * Math.max(1, input.headcount);
  return {
    basePrice,
    followerSurcharge,
    unitPrice,
    headcount: Math.max(1, input.headcount),
    totalPrice,
    currency: "KRW" as const,
  };
}

export function calculateSchedule(visitStartDate: Date, now = new Date()) {
  const fourteenDaysBefore = subDays(visitStartDate, 14);
  const todayPlusSeven = addDays(now, 7);
  const listDeliveryDate = fourteenDaysBefore > todayPlusSeven ? fourteenDaysBefore : todayPlusSeven;
  const uploadDueDate = addDays(visitStartDate, 7);
  const reportDueDate = addDays(uploadDueDate, 7);

  return {
    guidelineConfirmBy: listDeliveryDate,
    influencerListDeliveryDate: listDeliveryDate,
    visitStartDate,
    uploadDueDate,
    reportDueDate,
    rule: "max(visitStart-14d, today+7d)",
  };
}

export const draftPayloadSchema = z.object({
  name: z.string().optional(),
  currentStep: z.number().int().min(1).max(3).optional(),
  data: z.object({
    step1: z
      .object({
        campaignName: z.string().optional(),
        placeType: z.enum(PLACE_TYPE_VALUES).optional(),
        visitGoals: z.array(z.enum(VISIT_GOAL_VALUES)).optional(),
      })
      .optional(),
    step2: z
      .object({
        visitRegion: z.enum(REGION_VALUES).optional(),
        address: z.string().optional(),
        venueDescription: z.string().optional(),
        eventStartDate: z.string().optional(),
        eventEndDate: z.string().optional(),
        operationStartTime: z.string().optional(),
        operationEndTime: z.string().optional(),
        hasBenefits: z.boolean().optional(),
        benefitTypes: z.array(z.enum(BENEFIT_VALUES)).optional(),
        productDescription: z.string().optional(),
        productValueKrw: z.number().int().optional(),
      })
      .optional(),
    step3: z
      .object({
        targetRegions: z.array(z.enum(REGION_VALUES)).optional(),
        genderTarget: z.enum(GENDER_VALUES).optional(),
        followerTier: z.enum(FOLLOWER_TIER_VALUES).optional(),
        platforms: z.array(z.enum(PLATFORM_VALUES)).optional(),
        headcount: z.number().int().min(1).optional(),
      })
      .optional(),
  }),
});

export type DraftPayload = z.infer<typeof draftPayloadSchema>;

/** 캠페인 초안 PATCH/POST — 퍼널 폼 등 임의 JSON을 `CampaignDraft.data`에 저장 */
export const campaignDraftUpsertSchema = z.object({
  name: z.string().optional(),
  currentStep: z.number().int().min(1).max(3).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});
