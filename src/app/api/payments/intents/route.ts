import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

const schema = z.object({
  campaignId: z.string().min(1),
});

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: parsed.data.campaignId },
    include: { pricing: true },
  });
  if (!campaign || campaign.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  const amount = campaign.pricing?.totalPriceKrw ?? Math.round(campaign.budget);
  const payment = await prisma.payment.create({
    data: {
      brandId: authResult.session.user.id,
      campaignId: campaign.id,
      amount,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    paymentId: payment.id,
    status: payment.status,
    amount: payment.amount,
  });
}
