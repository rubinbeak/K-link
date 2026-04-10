import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Download, ListOrdered } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCampaignSubmitInstructions } from "@/lib/campaign-submit-instructions";
import { buildPaymentInvoiceDetail } from "@/lib/payment-invoice-detail";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { placeTypeLabel, platformLabel, regionLabel } from "@/lib/visit-campaign";

const cardBase =
  "rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_14px_44px_-28px_rgba(236,72,153,0.35)]";

export default async function CampaignSetupCompletePage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/campaign/setup/complete/${paymentId}`)}`);
  }
  if (session.user.role !== "BRAND") redirect("/auth/redirect");
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      brand: { select: { brandName: true, name: true, email: true, contactPhoneE164: true } },
      campaign: {
        include: {
          pricing: true,
          visitDetail: true,
          requirement: true,
        },
      },
    },
  });

  if (!payment || payment.brandId !== session.user.id || !payment.campaign) notFound();

  const detail = buildPaymentInvoiceDetail({
    payment: { id: payment.id, amount: payment.amount, createdAt: payment.createdAt },
    campaign: payment.campaign,
    brand: payment.brand,
    pricing: payment.campaign.pricing,
  });

  const instr = getCampaignSubmitInstructions();
  const visit = payment.campaign.visitDetail;
  const req = payment.campaign.requirement;

  const platformText =
    req?.platforms?.map((p) => platformLabel[p as keyof typeof platformLabel] ?? p).join(", ") ?? "—";
  const regionText =
    req?.targetRegions?.map((r) => regionLabel[r as keyof typeof regionLabel] ?? r).join(", ") ?? "—";
  const placeLabel =
    visit?.placeType && visit.placeType in placeTypeLabel
      ? placeTypeLabel[visit.placeType as keyof typeof placeTypeLabel]
      : visit?.placeType ?? "—";

  const processSteps = [
    "인보이스 발행 (이 페이지 및 다운로드 파일)",
    "안내 계좌로 무통장 입금",
    "입금 확인 후 캠페인 진행 시작",
    "세금계산서 발행 후 카카오톡(또는 이메일)로 송부",
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-3xl px-4 py-10">
        <Link href="/for-brands" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← 브랜드 페이지
        </Link>

        <div className="mb-8 flex items-start gap-3">
          <div className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-6" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary">캠페인 세팅 완료</p>
            <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              캠페인 세팅이 완료되었습니다
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              아래 정보를 확인하신 뒤 결제를 진행해 주세요. 입금이 확인되면 캠페인 진행이 시작됩니다.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListOrdered className="size-5 text-primary" aria-hidden />
                1. 캠페인 정보 정리
              </CardTitle>
              <CardDescription>제출하신 내용이 시스템에 등록된 요약입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-zinc-700">
              <p>
                <span className="text-zinc-500">캠페인 ID</span>{" "}
                <span className="font-mono font-medium text-zinc-900">{payment.campaign.id}</span>
              </p>
              <p>
                <span className="text-zinc-500">캠페인명</span>{" "}
                <span className="font-medium text-zinc-900">{payment.campaign.title}</span>
              </p>
              {visit ? (
                <>
                  <p>
                    <span className="text-zinc-500">방문 장소 유형</span>{" "}
                    <span className="font-medium text-zinc-900">{placeLabel}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">주소</span>{" "}
                    <span className="font-medium text-zinc-900">{visit.address}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">일정</span>{" "}
                    <span className="font-medium text-zinc-900">
                      {visit.eventStartDate.toLocaleDateString("ko-KR")}
                      {visit.eventEndDate ? ` ~ ${visit.eventEndDate.toLocaleDateString("ko-KR")}` : ""} ·{" "}
                      {visit.operationStartTime}–{visit.operationEndTime}
                    </span>
                  </p>
                </>
              ) : null}
              {req ? (
                <>
                  <p>
                    <span className="text-zinc-500">타겟 지역</span>{" "}
                    <span className="font-medium text-zinc-900">{regionText}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">플랫폼</span>{" "}
                    <span className="font-medium text-zinc-900">{platformText}</span>
                  </p>
                  <p>
                    <span className="text-zinc-500">인원</span>{" "}
                    <span className="font-medium text-zinc-900">{req.headcount}명</span>
                  </p>
                </>
              ) : null}
              <div>
                <p className="text-zinc-500">상세 / 제공 정보</p>
                <p className="mt-1 whitespace-pre-wrap rounded-lg border border-zinc-100 bg-zinc-50/80 p-3 text-zinc-800">
                  {payment.campaign.description || "—"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="text-lg">2. 결제 프로세스</CardTitle>
              <CardDescription>진행 순서를 한눈에 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm text-zinc-700">
                {processSteps.map((label, i) => (
                  <li key={label} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{label}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-zinc-500">{instr.referenceNote}</p>
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg">3. 인보이스</CardTitle>
                <CardDescription>재무·결재용으로 파일을 내려받을 수 있습니다.</CardDescription>
              </div>
              <a
                href={`/api/payments/${paymentId}/invoice/download`}
                className={cn(buttonVariants({ className: "gap-2 shrink-0 bg-[#ff2f9b] text-white hover:bg-[#e61c8d]" }))}
              >
                <Download className="size-4" aria-hidden />
                인보이스 다운로드 (HTML)
              </a>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-zinc-700">
              <p>
                Invoice 번호: <span className="font-mono font-semibold text-zinc-900">{detail.invoiceNumber}</span>
              </p>
              <p>
                발행일: <span className="font-medium text-zinc-900">{detail.issuedAt.toLocaleDateString("ko-KR")}</span> ·
                납부 기한: <span className="font-medium text-zinc-900">{detail.dueDate.toLocaleDateString("ko-KR")}</span>
              </p>
              <p>
                공급자: <span className="font-medium text-zinc-900">{detail.supplierName}</span>
                {detail.supplierBusinessRegNo ? ` (${detail.supplierBusinessRegNo})` : ""}
              </p>
              <p className="text-zinc-600">{detail.supplierAddress}</p>
              <p>
                고객사: <span className="font-medium text-zinc-900">{detail.clientCompanyName}</span> / 담당자:{" "}
                <span className="font-medium text-zinc-900">{detail.clientManagerLine}</span>
              </p>
              <p>
                금액: 공급가액 {detail.subtotalKrw.toLocaleString("ko-KR")}원
                {detail.vatKrw > 0 ? ` · 부가세 ${detail.vatKrw.toLocaleString("ko-KR")}원` : ""} · 합계{" "}
                <span className="font-semibold text-primary">{detail.totalKrw.toLocaleString("ko-KR")}원</span>
              </p>
              <p className="text-xs text-zinc-500">{detail.vatNote}</p>
              <p>
                K-LINK 담당: {detail.issuerName} / {detail.issuerEmail}
                {detail.issuerPhone !== "—" ? ` / ${detail.issuerPhone}` : ""}
              </p>
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="text-lg">4. 무통장입금 계좌</CardTitle>
              <CardDescription>입금 시 인보이스의 참조코드를 이체 메모에 넣어 주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-sm">
              <p>
                은행: <span className="font-medium text-zinc-900">{detail.bankName}</span>
              </p>
              <p>
                계좌번호: <span className="font-medium text-zinc-900">{detail.accountNumber}</span>
              </p>
              <p>
                예금주: <span className="font-medium text-zinc-900">{detail.accountHolder}</span>
              </p>
              <p>
                참조(메모): <span className="font-mono font-medium text-zinc-900">{detail.reference}</span>
              </p>
            </CardContent>
          </Card>

          <Card className={cn(cardBase, "border-emerald-100 bg-emerald-50/30")}>
            <CardHeader>
              <CardTitle className="text-lg">입금 이후</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-zinc-700">
              <p>{instr.postPaymentContact}</p>
              <p>{instr.taxInvoiceProcess}</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 pt-2">
            <Link href="/brand" className={cn(buttonVariants({ variant: "outline" }))}>
              마이페이지
            </Link>
            <Link href="/campaign/setup" className={cn(buttonVariants({ variant: "default", className: "bg-[#ff2f9b] hover:bg-[#e61c8d]" }))}>
              새 캠페인 세팅
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
