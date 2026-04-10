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

function SummaryTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label} className="border-b border-zinc-100 last:border-b-0">
              <th
                scope="row"
                className="w-[min(11rem,34%)] bg-zinc-50/90 px-4 py-3 text-left align-top text-xs font-semibold text-zinc-500 sm:px-5 sm:text-sm"
              >
                {label}
              </th>
              <td className="px-4 py-3 align-top text-zinc-900 sm:px-5">
                <span className="break-words leading-relaxed">{value}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

  const scheduleText = visit
    ? `${visit.eventStartDate.toLocaleDateString("ko-KR")}${
        visit.eventEndDate ? ` ~ ${visit.eventEndDate.toLocaleDateString("ko-KR")}` : ""
      } · ${visit.operationStartTime}–${visit.operationEndTime}`
    : "—";

  const summaryRows: { label: string; value: string }[] = [
    { label: "캠페인 ID", value: payment.campaign.id },
    { label: "캠페인명", value: payment.campaign.title },
  ];
  if (visit) {
    summaryRows.push(
      { label: "방문 장소 유형", value: placeLabel },
      { label: "주소", value: visit.address },
      { label: "일정", value: scheduleText },
    );
  }
  if (req) {
    summaryRows.push(
      { label: "타겟 지역", value: regionText },
      { label: "플랫폼", value: platformText },
      { label: "인원", value: `${req.headcount}명` },
    );
  }
  summaryRows.push({
    label: "상세 / 제공 정보",
    value: payment.campaign.description?.trim() || "—",
  });

  const processSteps = [
    "인보이스 확인 (이 페이지 및 PDF)",
    "안내 계좌로 무통장 입금",
    "입금 확인 후 캠페인 진행 시작",
    "세금계산서 발행 후 카카오톡(또는 이메일)로 송부",
  ];

  const vatLine =
    detail.vatKrw > 0 ? `${detail.vatKrw.toLocaleString("ko-KR")}원` : "— (별도 안내)";

  const invoiceRows: { label: string; value: string }[] = [
    { label: "Invoice 번호", value: detail.invoiceNumber },
    {
      label: "발행일 / 납부 기한",
      value: `${detail.issuedAt.toLocaleDateString("ko-KR")} · ${detail.dueDate.toLocaleDateString("ko-KR")}`,
    },
    {
      label: "공급자",
      value: detail.supplierBusinessRegNo
        ? `${detail.supplierName} (사업자등록번호 ${detail.supplierBusinessRegNo})`
        : detail.supplierName,
    },
    { label: "공급자 주소", value: detail.supplierAddress },
    { label: "고객사", value: detail.clientCompanyName },
    { label: "담당자", value: detail.clientManagerLine },
    {
      label: "금액",
      value: `공급가액 ${detail.subtotalKrw.toLocaleString("ko-KR")}원 · 부가세 ${vatLine} · 합계 ${detail.totalKrw.toLocaleString("ko-KR")}원`,
    },
    { label: "VAT 안내", value: detail.vatNote },
    {
      label: "K-LINK 담당",
      value: [detail.issuerName, detail.issuerEmail, detail.issuerPhone !== "—" ? detail.issuerPhone : null]
        .filter(Boolean)
        .join(" · "),
    },
  ];

  const bankRows: { label: string; value: string }[] = [
    { label: "은행", value: detail.bankName },
    { label: "계좌번호", value: detail.accountNumber },
    { label: "예금주", value: detail.accountHolder },
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-4xl px-4 py-10">
        <Link href="/for-brands" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← 브랜드 페이지
        </Link>

        <header className="mb-10 text-center">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
            <div
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 sm:size-14"
              aria-hidden
            >
              <CheckCircle2 className="size-7 sm:size-8" />
            </div>
            <div className="min-w-0 space-y-2 text-center">
              <p className="text-xs font-semibold tracking-wide text-primary">캠페인 세팅 완료</p>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                캠페인 세팅이 완료되었습니다
              </h1>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-zinc-600">
            아래 정보를 확인하신 뒤 결제를 진행해 주세요. 입금이 확인되면 캠페인 진행이 시작됩니다.
          </p>
        </header>

        <div className="space-y-6">
          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListOrdered className="size-5 text-primary" aria-hidden />
                1. 캠페인 정보 정리
              </CardTitle>
              <CardDescription>제출하신 내용이 시스템에 등록된 요약입니다.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-5 pt-0 sm:px-6">
              <SummaryTable rows={summaryRows} />
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="text-lg">2. 결제 프로세스</CardTitle>
              <CardDescription>아래 순서대로 진행됩니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              <ol className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-zinc-50/40">
                {processSteps.map((label, i) => (
                  <li key={label} className="flex gap-4 px-4 py-3.5 sm:px-5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-sm leading-relaxed text-zinc-800">{label}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg">3. 인보이스</CardTitle>
                <CardDescription>재무·결재용 PDF로 내려받을 수 있습니다.</CardDescription>
              </div>
              <a
                href={`/api/payments/${paymentId}/invoice/download`}
                className={cn(
                  buttonVariants({
                    className: "h-10 gap-2 shrink-0 bg-[#ff2f9b] px-4 text-white hover:bg-[#e61c8d]",
                  }),
                )}
              >
                <Download className="size-4" aria-hidden />
                인보이스 PDF 다운로드
              </a>
            </CardHeader>
            <CardContent className="px-4 pb-5 pt-0 sm:px-6">
              <SummaryTable rows={invoiceRows} />
            </CardContent>
          </Card>

          <Card className={cn(cardBase)}>
            <CardHeader>
              <CardTitle className="text-lg">4. 무통장입금 계좌</CardTitle>
              <CardDescription>아래 계좌로 합계 금액을 입금해 주세요.</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-5 pt-0 sm:px-6">
              <SummaryTable rows={bankRows} />
            </CardContent>
          </Card>

          <Card className={cn(cardBase, "border-emerald-200/80 bg-emerald-50/25")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-emerald-950">입금 이후</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-800">
              <div className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3.5 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">연락</p>
                <p className="mt-2 leading-relaxed">{instr.postPaymentContact}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white/80 px-4 py-3.5 sm:px-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">세금계산서</p>
                <p className="mt-2 leading-relaxed">{instr.taxInvoiceProcess}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link href="/brand" className={cn(buttonVariants({ variant: "outline" }))}>
              마이페이지
            </Link>
            <Link
              href="/campaign/setup"
              className={cn(buttonVariants({ variant: "default", className: "bg-[#ff2f9b] hover:bg-[#e61c8d]" }))}
            >
              새 캠페인 세팅
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
