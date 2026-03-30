"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, CampaignStatus } from "@/generated/prisma";

export async function applyToCampaign(campaignId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "INFLUENCER") {
    throw new Error("Unauthorized");
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, status: CampaignStatus.OPEN },
  });
  if (!campaign) throw new Error("Campaign not available");

  const existing = await prisma.application.findUnique({
    where: {
      campaignId_influencerId: {
        campaignId,
        influencerId: session.user.id,
      },
    },
  });
  if (!existing) {
    await prisma.application.create({
      data: {
        campaignId,
        influencerId: session.user.id,
        status: ApplicationStatus.PENDING,
      },
    });
  }

  revalidatePath("/influencer/feed");
  revalidatePath("/influencer/my");
}

export async function submitContentLink(applicationId: string, contentUrl: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "INFLUENCER") {
    throw new Error("Unauthorized");
  }

  const url = contentUrl.trim();
  if (!url) throw new Error("Link required");

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });
  if (!application || application.influencerId !== session.user.id) {
    throw new Error("Not found");
  }
  if (application.status !== ApplicationStatus.SELECTED) {
    throw new Error("Only selected creators can submit");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { contentUrl: url, status: ApplicationStatus.SUBMITTED },
  });

  revalidatePath("/influencer/my");
}
