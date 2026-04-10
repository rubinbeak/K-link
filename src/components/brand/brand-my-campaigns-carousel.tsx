"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantActionButtons } from "@/app/brand/applicant-actions";
import { applicationStatusClass, campaignLifecycleClass, campaignStatusClass, paymentStatusClass } from "@/lib/status-styles";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  applicationStatusLabel,
  campaignLifecycleLabel,
  campaignStatusLabel,
  campaignTypeLabel,
  paymentStatusLabel,
} from "@/lib/brand-ui-labels";
import type {
  ApplicationStatus,
  CampaignLifecycleStatus,
  CampaignStatus,
  CampaignType,
  PaymentStatus,
} from "@/generated/prisma";

export type BrandMyCampaignItem = {
  id: string;
  title: string;
  description: string;
  lifecycle: CampaignLifecycleStatus;
  status: CampaignStatus;
  campaignType: CampaignType | null;
  createdAtLabel: string;
  budget: number;
  visitLine: string | null;
  visitAddress: string | null;
  payment: { id: string; status: PaymentStatus; amount: number } | null;
  applications: Array<{
    id: string;
    status: ApplicationStatus;
    contentUrl: string | null;
    influencer: { name: string | null; email: string; bio: string | null };
  }>;
};

function CampaignSlideCard({ c }: { c: BrandMyCampaignItem }) {
  const payment = c.payment;
  const desc =
    c.description.length > 160 ? `${c.description.slice(0, 160)}…` : c.description;

  return (
    <Card className="mx-auto flex w-full max-w-xl flex-col overflow-hidden border-border/60 shadow-md">
      <CardHeader className="space-y-4 pb-4 text-center">
        <div className="space-y-3">
          <CardTitle className="font-heading text-xl leading-snug sm:text-2xl">{c.title}</CardTitle>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className={campaignLifecycleClass(c.lifecycle)} variant="secondary">
              {campaignLifecycleLabel(c.lifecycle)}
            </Badge>
            <Badge className={campaignStatusClass(c.status)} variant="secondary">
              {campaignStatusLabel(c.status)}
            </Badge>
          </div>
        </div>
        <CardDescription className="mx-auto max-w-md text-pretty text-center text-sm leading-relaxed text-muted-foreground">
          {desc}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 border-t border-border/50 bg-muted/25 px-5 py-5 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">캠페인 ID</p>
            <p className="mt-1 break-all font-mono text-xs text-foreground">{c.id}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">유형</p>
            <p className="mt-1 font-medium text-foreground">{campaignTypeLabel(c.campaignType)}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">등록일</p>
            <p className="mt-1 text-foreground">{c.createdAtLabel}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">견적(예산)</p>
            <p className="mt-1 font-semibold text-foreground">{Math.round(c.budget).toLocaleString("ko-KR")}원</p>
          </div>
          {c.visitLine ? (
            <div className="sm:col-span-2 rounded-lg border border-border/40 bg-background/80 px-4 py-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">방문 일정</p>
              <p className="mt-1 text-foreground">{c.visitLine}</p>
              {c.visitAddress ? (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{c.visitAddress}</p>
              ) : null}
            </div>
          ) : null}
          <div className="sm:col-span-2 rounded-lg border border-border/40 bg-background/80 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">결제</p>
            {payment ? (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <Badge className={paymentStatusClass(payment.status)} variant="secondary">
                  {paymentStatusLabel(payment.status)}
                </Badge>
                <span className="font-medium text-foreground">
                  {Math.round(payment.amount).toLocaleString("ko-KR")}원
                </span>
              </div>
            ) : (
              <p className="mt-2 text-muted-foreground">연결된 결제 건이 없습니다.</p>
            )}
          </div>
        </div>
      </CardContent>

      {payment ? (
        <CardFooter className="flex flex-wrap justify-center gap-2 border-t bg-muted/35 px-4 py-4">
          <Link
            href={`/campaign/setup/complete/${payment.id}`}
            className={cn(buttonVariants({ size: "sm", className: "bg-[#ff2f9b] text-white hover:bg-[#e61c8d]" }))}
          >
            결제·완료 안내
          </Link>
          <Link href={`/brand/payments/${payment.id}/invoice`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            인보이스 화면
          </Link>
          <a
            href={`/api/payments/${payment.id}/invoice/download`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            PDF 다운로드
          </a>
        </CardFooter>
      ) : null}

      {c.applications.length > 0 ? (
        <div className="border-t border-border/60 px-4 py-4">
          <details className="group mx-auto max-w-lg">
            <summary className="cursor-pointer list-none text-center text-sm font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center justify-center gap-2">
                지원자 {c.applications.length}명
                <span className="text-xs font-normal text-muted-foreground group-open:hidden">펼치기</span>
                <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
              </span>
            </summary>
            <ul className="mt-4 space-y-3">
              {c.applications.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-medium">{a.influencer.name ?? a.influencer.email}</p>
                    <p className="text-xs text-muted-foreground">{a.influencer.email}</p>
                    {a.influencer.bio ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">{a.influencer.bio}</p>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                      <Badge className={applicationStatusClass(a.status)} variant="secondary">
                        {applicationStatusLabel(a.status)}
                      </Badge>
                      {a.contentUrl ? (
                        <a
                          href={a.contentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                        >
                          콘텐츠 보기
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <ApplicantActionButtons applicationId={a.id} currentStatus={a.status} />
                </li>
              ))}
            </ul>
          </details>
        </div>
      ) : null}
    </Card>
  );
}

export function BrandMyCampaignsCarousel({ campaigns }: { campaigns: BrandMyCampaignItem[] }) {
  const [index, setIndex] = useState(0);
  const n = campaigns.length;
  const canPrev = index > 0;
  const canNext = index < n - 1;

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(n - 1, i + 1)), [n]);

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, n - 1)));
  }, [n]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (n <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n, goPrev, goNext]);

  if (n === 0) return null;

  if (n === 1) {
    return (
      <div className="mx-auto flex w-full max-w-4xl justify-center px-1">
        <CampaignSlideCard c={campaigns[0]} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center justify-center gap-1 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full border-zinc-300 shadow-sm"
          aria-label="이전 캠페인"
          disabled={!canPrev}
          onClick={goPrev}
        >
          <ChevronLeft className="size-5" />
        </Button>

        <div className="min-w-0 flex-1 overflow-hidden px-1 sm:px-2">
          <div
            className="flex transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {campaigns.map((c) => (
              <div key={c.id} className="w-full shrink-0 px-0.5">
                <CampaignSlideCard c={c} />
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full border-zinc-300 shadow-sm"
          aria-label="다음 캠페인"
          disabled={!canNext}
          onClick={goNext}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {index + 1} / {n} · 좌우 화살표 키로도 이동할 수 있어요
      </p>
    </div>
  );
}
