import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { buildInvoice } from "@/lib/invoice";

export async function GET(_request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult.response;

  const { paymentId } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      campaign: true,
      brand: true,
    },
  });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  const role = authResult.session.user.role;
  if (role !== "ADMIN" && payment.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invoice = buildInvoice({
    paymentId: payment.id,
    amount: Math.round(payment.amount),
    issuedAt: payment.createdAt,
    campaignTitle: payment.campaign?.title,
    brandName: payment.brand.brandName ?? payment.brand.name,
  });

  return NextResponse.json({
    paymentId: payment.id,
    paymentStatus: payment.status,
    campaignId: payment.campaignId,
    invoice,
  });
}
