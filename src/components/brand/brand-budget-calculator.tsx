"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { brandPrimaryCtaLabel } from "@/lib/brand-marketing-copy";
import { cn } from "@/lib/utils";

const UNIT_LTE_5K = 250_000;
const UNIT_GTE_5K = 500_000;

const money = new Intl.NumberFormat("ko-KR");

const SLIDER_MAX = 30;

export function BrandBudgetCalculator() {
  const [under5k, setUnder5k] = useState(4);
  const [over5k, setOver5k] = useState(2);

  const price = useMemo(() => {
    const subUnder = under5k * UNIT_LTE_5K;
    const subOver = over5k * UNIT_GTE_5K;
    return {
      under5k,
      over5k,
      subUnder,
      subOver,
      total: subUnder + subOver,
      headcount: under5k + over5k,
    };
  }, [under5k, over5k]);

  return (
    <section className="brand-panel relative overflow-hidden p-6">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-transparent" />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="relative">
          <p className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Calculator className="size-3.5" />
            즉시 예산 계산
          </p>
          <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight">캠페인 예상 비용을 바로 확인해보세요</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            팔로워 <span className="font-medium text-foreground">5천 이하</span> 인원과{" "}
            <span className="font-medium text-foreground">5천 이상</span> 인원을 각각 조절하면 복합 플랜도 한 번에 합산됩니다.
          </p>
        </div>
        <span className="relative inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          실시간 계산
        </span>
      </div>

      <div className="relative mt-6 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <div className="brand-panel-muted border border-border/40 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label className="text-sm font-medium text-foreground">팔로워 5천 이하</label>
              <span className="text-sm tabular-nums text-muted-foreground">
                <span className="font-semibold text-primary">{under5k}명</span>
                <span className="mx-1.5 text-border">·</span>
                인당 {money.format(UNIT_LTE_5K)}원
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={SLIDER_MAX}
              value={under5k}
              onChange={(e) => setUnder5k(Number(e.target.value))}
              className="mt-3 w-full accent-primary"
              aria-valuetext={`${under5k}명`}
            />
            <p className="mt-2 text-xs text-muted-foreground">해당 구간만 쓰는 경우 이 바만 조절하면 됩니다.</p>
          </div>

          <div className="brand-panel-muted border border-border/40 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <label className="text-sm font-medium text-foreground">팔로워 5천 이상</label>
              <span className="text-sm tabular-nums text-muted-foreground">
                <span className="font-semibold text-primary">{over5k}명</span>
                <span className="mx-1.5 text-border">·</span>
                인당 {money.format(UNIT_GTE_5K)}원
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={SLIDER_MAX}
              value={over5k}
              onChange={(e) => setOver5k(Number(e.target.value))}
              className="mt-3 w-full accent-fuchsia-500"
              aria-valuetext={`${over5k}명`}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              5천 이상 구간은 1인 기준 {money.format(UNIT_GTE_5K)}원 단가가 적용됩니다.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-primary px-4 py-4 text-primary-foreground shadow-sm">
          <div className="space-y-2 text-sm">
            {under5k > 0 && (
              <p className="flex items-center justify-between gap-2 text-primary-foreground/90">
                <span>5천 이하 × {under5k}명</span>
                <span className="shrink-0 font-medium tabular-nums">{money.format(price.subUnder)}원</span>
              </p>
            )}
            {over5k > 0 && (
              <p className="flex items-center justify-between gap-2 text-primary-foreground/90">
                <span>5천 이상 × {over5k}명</span>
                <span className="shrink-0 font-medium tabular-nums">{money.format(price.subOver)}원</span>
              </p>
            )}
            {price.headcount === 0 && (
              <p className="text-primary-foreground/75">슬라이더로 인원을 선택하면 금액이 표시됩니다.</p>
            )}
            {price.headcount > 0 && (
              <p className="flex items-center justify-between border-t border-white/20 pt-2 text-primary-foreground/90">
                <span>모집 합계</span>
                <span className="font-semibold tabular-nums">{price.headcount}명</span>
              </p>
            )}
          </div>
          <div className="mt-4 rounded-lg bg-white/12 p-4">
            <p className="text-xs text-primary-foreground/80">예상 총액</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-white tabular-nums">{money.format(price.total)}원</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }), "flex-1 bg-white text-center text-xs font-semibold leading-snug text-primary hover:bg-white/90 sm:text-sm")}>
              {brandPrimaryCtaLabel}
            </Link>
            <Link
              href="/consulting"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "flex-1 border-white/60 bg-transparent text-white hover:bg-white/10 hover:text-white",
              )}
            >
              상담 요청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
