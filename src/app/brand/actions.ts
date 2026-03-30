"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus, CampaignStatus, PaymentStatus } from "@/generated/prisma";

export async function createCampaign(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const budgetRaw = String(formData.get("budget") ?? "").trim();
  const budget = Number.parseFloat(budgetRaw);

  if (!title || !description || !Number.isFinite(budget) || budget <= 0) {
    throw new Error("Invalid campaign fields");
  }

  const campaign = await prisma.campaign.create({
    data: {
      brandId: session.user.id,
      title,
      description,
      budget,
      status: CampaignStatus.OPEN,
    },
  });

  await prisma.payment.create({
    data: {
      brandId: session.user.id,
      campaignId: campaign.id,
      amount: budget,
      status: PaymentStatus.PENDING,
    },
  });

  revalidatePath("/brand");
}

export async function createCampaignForm(formData: FormData) {
  await createCampaign(formData);
  redirect("/brand");
}

export async function selectApplicant(applicationId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") {
    throw new Error("Unauthorized");
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { campaign: true },
  });

  if (!application || application.campaign.brandId !== session.user.id) {
    throw new Error("Not found");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.SELECTED },
  });

  revalidatePath("/brand");
}

export async function rejectApplicant(applicationId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") {
    throw new Error("Unauthorized");
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { campaign: true },
  });

  if (!application || application.campaign.brandId !== session.user.id) {
    throw new Error("Not found");
  }

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: ApplicationStatus.REJECTED },
  });

  revalidatePath("/brand");
}
