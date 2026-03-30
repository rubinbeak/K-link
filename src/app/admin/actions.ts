"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CampaignStatus, PaymentStatus } from "@/generated/prisma";

export async function setCampaignStatus(campaignId: string, status: CampaignStatus) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.campaign.update({
    where: { id: campaignId },
    data: { status },
  });

  revalidatePath("/admin");
}

export async function setPaymentStatus(paymentId: string, status: PaymentStatus) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.payment.update({
    where: { id: paymentId },
    data: { status },
  });

  revalidatePath("/admin");
}
