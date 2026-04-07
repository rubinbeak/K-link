import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult.response;
  const { paymentId } = await params;

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  const role = authResult.session.user.role;
  if (role !== "ADMIN" && role !== "BRAND") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (role === "BRAND" && payment.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "COMPLETED" },
  });

  if (updated.campaignId) {
    await prisma.campaign.update({
      where: { id: updated.campaignId },
      data: { lifecycle: "PAID" },
    });
  }

  return NextResponse.json({
    paymentId: updated.id,
    status: updated.status,
    campaignStatus: "PAID",
  });
}
