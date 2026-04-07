import "dotenv/config";
import { hashSync } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  CampaignStatus,
  ApplicationStatus,
  PaymentStatus,
  CampaignType,
  CampaignLifecycleStatus,
  PlaceType,
  VisitGoal,
  RegionCode,
  BenefitType,
  GenderTarget,
  FollowerTier,
  PlatformType,
} from "../src/generated/prisma";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required for seed");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

async function main() {
  const password = hashSync("demo123", 10);

  await prisma.visitBenefit.deleteMany();
  await prisma.schedulePlan.deleteMany();
  await prisma.pricingSnapshot.deleteMany();
  await prisma.influencerRequirement.deleteMany();
  await prisma.visitCampaignDetail.deleteMany();
  await prisma.consultingLead.deleteMany();
  await prisma.campaignDraft.deleteMany();
  await prisma.application.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();

  const brand = await prisma.user.create({
    data: {
      email: "brand@k-link.demo",
      name: "Glow Seoul Beauty",
      password,
      role: Role.BRAND,
      brandName: "Glow Seoul Beauty",
    },
  });

  const influencer = await prisma.user.create({
    data: {
      email: "influencer@k-link.demo",
      name: "Mina Park",
      password,
      role: Role.INFLUENCER,
      bio: "K-beauty & lifestyle · NYC · 120k followers",
      instagram: "@minakbeauty",
      tiktok: "@minak",
    },
  });

  const influencer2 = await prisma.user.create({
    data: {
      email: "creator@k-link.demo",
      name: "Alex Rivera",
      password,
      role: Role.INFLUENCER,
      bio: "Skincare routines · LA",
      instagram: "@alexskin",
    },
  });

  await prisma.user.create({
    data: {
      email: "admin@k-link.demo",
      name: "K-LINK Admin",
      password,
      role: Role.ADMIN,
    },
  });

  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: "Spring Glass Skin Serum Launch",
      description:
        "Create 1 Instagram Reel + 2 Stories featuring our new serum. Tone: luminous, minimal, authentic.",
      budget: 2500,
      status: CampaignStatus.OPEN,
      campaignType: CampaignType.VISIT_CONTENT,
      lifecycle: CampaignLifecycleStatus.PAID,
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: "Lip Tint Global Push",
      description: "Short-form video on TikTok or Reels. English or bilingual captions welcome.",
      budget: 1800,
      status: CampaignStatus.OPEN,
      campaignType: CampaignType.VISIT_CONTENT,
      lifecycle: CampaignLifecycleStatus.READY_FOR_PAYMENT,
    },
  });

  const visitCampaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: "도쿄 팝업스토어 방문형 콘텐츠 캠페인",
      description: "방문형 콘텐츠 전용 파일럿. 섭외부터 보고까지 운영.",
      budget: 1750000,
      status: CampaignStatus.OPEN,
      campaignType: CampaignType.VISIT_CONTENT,
      lifecycle: CampaignLifecycleStatus.READY_FOR_PAYMENT,
    },
  });

  const visitDetail = await prisma.visitCampaignDetail.create({
    data: {
      campaignId: visitCampaign.id,
      placeType: PlaceType.POPUP_STORE,
      visitGoals: [VisitGoal.INTRO_EVENT, VisitGoal.PRODUCT_TRY_PROMO],
      visitRegion: RegionCode.JP,
      address: "Shibuya, Tokyo, Japan",
      venueDescription: "K-beauty pop-up store at Shibuya district.",
      eventStartDate: new Date("2026-05-20T00:00:00.000Z"),
      eventEndDate: new Date("2026-05-22T00:00:00.000Z"),
      operationStartTime: "10:00",
      operationEndTime: "20:00",
      hasBenefits: true,
    },
  });

  await prisma.visitBenefit.createMany({
    data: [
      {
        visitCampaignId: visitDetail.id,
        type: BenefitType.PRODUCT,
        productDescription: "신제품 세럼 2종 제공",
        productValueKrw: 120000,
      },
      {
        visitCampaignId: visitDetail.id,
        type: BenefitType.EXPERIENCE,
      },
    ],
  });

  await prisma.influencerRequirement.create({
    data: {
      campaignId: visitCampaign.id,
      targetRegions: [RegionCode.JP, RegionCode.KR],
      genderTarget: GenderTarget.ANY,
      followerTier: FollowerTier.BETWEEN_5K_30K,
      headcount: 5,
      platforms: [PlatformType.INSTAGRAM, PlatformType.TIKTOK, PlatformType.XIAOHONGSHU],
      uploadDueDays: 7,
    },
  });

  await prisma.pricingSnapshot.create({
    data: {
      campaignId: visitCampaign.id,
      basePriceKrw: 250000,
      followerSurchargeKrw: 200000,
      unitPriceKrw: 450000,
      headcount: 5,
      totalPriceKrw: 2250000,
      currency: "KRW",
    },
  });

  await prisma.schedulePlan.create({
    data: {
      campaignId: visitCampaign.id,
      guidelineConfirmBy: new Date("2026-05-06T00:00:00.000Z"),
      influencerListDelivery: new Date("2026-05-06T00:00:00.000Z"),
      visitStartDate: new Date("2026-05-20T00:00:00.000Z"),
      uploadDueDate: new Date("2026-05-27T00:00:00.000Z"),
      reportDueDate: new Date("2026-06-03T00:00:00.000Z"),
    },
  });

  const visitDraft = await prisma.campaignDraft.create({
    data: {
      brandId: brand.id,
      name: "오사카 쇼룸 방문 콘텐츠 초안",
      currentStep: 2,
      autosaveVersion: 3,
      data: {
        step1: {
          campaignName: "오사카 쇼룸 방문 콘텐츠",
          placeType: PlaceType.FASHION_SHOWROOM,
          visitGoals: [VisitGoal.INTRO_STORE, VisitGoal.BRAND_EXPERIENCE],
        },
        step2: {
          visitRegion: RegionCode.JP,
          address: "Umeda, Osaka, Japan",
          venueDescription: "쇼룸 프라이빗 행사",
          eventStartDate: "2026-06-10",
          operationStartTime: "11:00",
          operationEndTime: "19:00",
          hasBenefits: true,
          benefitTypes: [BenefitType.PRODUCT],
          productDescription: "메이크업 키트",
          productValueKrw: 80000,
        },
      },
    },
  });

  await prisma.consultingLead.createMany({
    data: [
      {
        userId: brand.id,
        channel: "KAKAO",
        name: "김브랜드",
        company: "Glow Seoul Beauty",
        email: "brand@k-link.demo",
        phone: "010-1234-5678",
        targetRegion: RegionCode.JP,
        message: "도쿄/오사카 방문형 캠페인 운영 문의",
        status: "RECEIVED",
      },
      {
        channel: "MEETING",
        name: "박마케터",
        company: "Fruitnara",
        email: "marketing@fruitnara.example",
        targetRegion: RegionCode.US,
        message: "미국 서부 지역 방문형 콘텐츠 파일럿 상담 요청",
        status: "RECEIVED",
      },
    ],
  });

  await prisma.application.create({
    data: {
      campaignId: campaign.id,
      influencerId: influencer.id,
      status: ApplicationStatus.PENDING,
    },
  });

  await prisma.application.create({
    data: {
      campaignId: campaign.id,
      influencerId: influencer2.id,
      status: ApplicationStatus.SELECTED,
    },
  });

  await prisma.payment.create({
    data: {
      brandId: brand.id,
      campaignId: campaign.id,
      amount: 2500,
      status: PaymentStatus.COMPLETED,
    },
  });

  await prisma.payment.create({
    data: {
      brandId: brand.id,
      campaignId: campaign2.id,
      amount: 1800,
      status: PaymentStatus.PENDING,
    },
  });

  await prisma.payment.create({
    data: {
      brandId: brand.id,
      campaignId: visitCampaign.id,
      amount: 1750000,
      status: PaymentStatus.PENDING,
    },
  });

  console.log("Seed complete. Demo logins (password: demo123):");
  console.log("  Brand:       brand@k-link.demo");
  console.log("  Influencer:  influencer@k-link.demo  |  creator@k-link.demo");
  console.log("  Admin:       admin@k-link.demo");
  console.log(`  Visit draft: ${visitDraft.id}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
