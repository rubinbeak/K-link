import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { buildPaymentInvoiceDetail } from "@/lib/payment-invoice-detail";
import { renderPaymentInvoicePdf } from "@/lib/render-invoice-pdf";

export const runtime = "nodejs";

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

  let pdf: Buffer;
  try {
    pdf = await renderPaymentInvoicePdf(detail);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[invoice-pdf]", msg, e);
    return NextResponse.json({ error: "PDF 생성에 실패했습니다." }, { status: 500 });
  }

  const safeFile = detail.invoiceNumber.replace(/[^\w.-]+/g, "_");
  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${safeFile}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
