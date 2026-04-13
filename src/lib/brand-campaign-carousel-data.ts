import { prisma } from "@/lib/prisma";
import type { BrandMyCampaignItem } from "@/lib/brand-my-campaign-item";

export async function getBrandCampaignCarouselItems(brandId: string): Promise<BrandMyCampaignItem[]> {
  const campaigns = await prisma.campaign.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      visitDetail: {
        select: {
          eventStartDate: true,
          eventEndDate: true,
          address: true,
        },
      },
      applications: {
        include: { influencer: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return campaigns.map((c) => {
    const payment = c.payments[0];
    const visit = c.visitDetail;
    const visitLine = visit
      ? `${visit.eventStartDate.toLocaleDateString("ko-KR")}${
          visit.eventEndDate ? ` ~ ${visit.eventEndDate.toLocaleDateString("ko-KR")}` : ""
        }`
      : null;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      lifecycle: c.lifecycle,
      status: c.status,
      campaignType: c.campaignType,
      createdAtLabel: c.createdAt.toLocaleString("ko-KR"),
      budget: c.budget,
      visitLine,
      visitAddress: visit?.address ?? null,
      payment: payment ? { id: payment.id, status: payment.status, amount: payment.amount } : null,
      applications: c.applications.map((a) => ({
        id: a.id,
        status: a.status,
        contentUrl: a.contentUrl,
        influencer: {
          name: a.influencer.name,
          email: a.influencer.email,
          bio: a.influencer.bio,
        },
      })),
    };
  });
}
