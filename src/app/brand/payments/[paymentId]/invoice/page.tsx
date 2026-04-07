import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildInvoice } from "@/lib/invoice";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function BrandInvoicePage({ params }: { params: Promise<{ paymentId: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") redirect("/login");

  const { paymentId } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      campaign: true,
      brand: true,
    },
  });

  if (!payment || payment.brandId !== session.user.id) notFound();

  const invoice = buildInvoice({
    paymentId: payment.id,
    amount: Math.round(payment.amount),
    issuedAt: payment.createdAt,
    campaignTitle: payment.campaign?.title,
    brandName: payment.brand.brandName ?? payment.brand.name,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">INVOICE</p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">무통장입금 인보이스</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            재무팀 기안용으로 바로 전달할 수 있도록 결제 정보를 정리했습니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/brand" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            마이페이지
          </Link>
          <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }))}>
            새 캠페인 세팅
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{invoice.invoiceNumber}</CardTitle>
          <CardDescription>
            발행일 {invoice.issuedAt.toLocaleDateString("ko-KR")} · 납부기한 {invoice.dueDate.toLocaleDateString("ko-KR")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            브랜드명: <span className="font-medium">{invoice.brandName}</span>
          </p>
          <p>
            캠페인명: <span className="font-medium">{invoice.campaignTitle}</span>
          </p>
          <p>
            결제방식: <span className="font-medium">{invoice.paymentMethod}</span>
          </p>
          <p>
            입금금액: <span className="font-semibold text-primary">{invoice.amount.toLocaleString("ko-KR")}원</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>입금 계좌 정보</CardTitle>
          <CardDescription>입금 시 반드시 참조코드(Reference)를 함께 전달해 주세요.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>
            은행명: <span className="font-medium">{invoice.bankInfo.bankName}</span>
          </p>
          <p>
            계좌번호: <span className="font-medium">{invoice.bankInfo.accountNumber}</span>
          </p>
          <p>
            예금주: <span className="font-medium">{invoice.bankInfo.accountHolder}</span>
          </p>
          <p>
            참조코드: <span className="font-medium">{invoice.bankInfo.reference}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
