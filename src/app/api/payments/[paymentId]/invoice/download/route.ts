import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { buildPaymentInvoiceDetail, renderInvoiceHtmlDocument } from "@/lib/payment-invoice-detail";

export async function GET(_request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult.response;

  const { paymentId } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      brand: { select: { brandName: true, name: true, email: true, contactPhoneE164: true } },
      campaign: {
        select: {
          id: true,
          title: true,
          description: true,
          pricing: { select: { headcount: true, unitPriceKrw: true } },
        },
      },
    },
  });

  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  const role = authResult.session.user.role;
  if (role !== "ADMIN" && payment.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const detail = buildPaymentInvoiceDetail({
    payment: { id: payment.id, amount: payment.amount, createdAt: payment.createdAt },
    campaign: payment.campaign,
    brand: payment.brand,
    pricing: payment.campaign?.pricing ?? null,
  });

  const html = renderInvoiceHtmlDocument(detail);
  const safeFile = detail.invoiceNumber.replace(/[^\w.-]+/g, "_");
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeFile}.html"`,
      "Cache-Control": "private, no-store",
    },
  });
}
