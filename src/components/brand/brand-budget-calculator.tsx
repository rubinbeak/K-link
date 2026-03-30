"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type Tier = "LTE_5K" | "BETWEEN_5K_30K" | "GTE_30K";

const tierLabel: Record<Tier, string> = {
  LTE_5K: "팔로워 5천 이하",
  BETWEEN_5K_30K: "팔로워 5천 ~ 3만",
  GTE_30K: "팔로워 3만 이상",
};

const surchargeByTier: Record<Tier, number> = {
  LTE_5K: 0,
  BETWEEN_5K_30K: 100000,
  GTE_30K: 200000,
};

const money = new Intl.NumberFormat("ko-KR");

export function BrandBudgetCalculator() {
  const [headcount, setHeadcount] = useState(8);
  const [tier, setTier] = useState<Tier>("BETWEEN_5K_30K");

  const price = useMemo(() => {
    const base = 250000;
    const surcharge = surchargeByTier[tier];
    const unit = base + surcharge;
    return {
      base,
      surcharge,
      unit,
      headcount,
      total: unit * headcount,
    };
  }, [headcount, tier]);

  return (
    <section className="rounded-3xl border border-primary/25 bg-linear-to-r from-white via-pink-50 to-fuchsia-100/70 p-6 shadow-xl shadow-pink-100/45">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            <Calculator className="size-3.5" />
            즉시 예산 계산
          </p>
          <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight">캠페인 예상 비용을 바로 확인해보세요</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            인원 수와 크리에이터 구간만 선택하면 예상 총액이 실시간으로 계산됩니다.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-white/80 px-2.5 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          실시간 계산
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4 rounded-2xl border border-white/80 bg-white/70 p-4">
          <label className="block text-sm font-medium">
            모집 인원
            <span className="ml-2 text-primary">{headcount}명</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={headcount}
            onChange={(e) => setHeadcount(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            {(Object.keys(tierLabel) as Tier[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTier(key)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left transition",
                  tier === key
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border/70 bg-background/80 text-muted-foreground hover:border-primary/25 hover:text-foreground",
                )}
              >
                {tierLabel[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/90 p-4 shadow-sm">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center justify-between">
              <span>기본 단가</span>
              <span className="font-medium text-foreground">{money.format(price.base)}원</span>
            </p>
            <p className="flex items-center justify-between">
              <span>팔로워 구간 추가금</span>
              <span className="font-medium text-foreground">+{money.format(price.surcharge)}원</span>
            </p>
            <p className="flex items-center justify-between border-t border-border/60 pt-2">
              <span>1인 단가</span>
              <span className="font-semibold text-foreground">{money.format(price.unit)}원</span>
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-xs text-muted-foreground">예상 총액 ({price.headcount}명 기준)</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">{money.format(price.total)}원</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }), "flex-1")}>
              이 조건으로 세팅 시작
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}>
              상담 요청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
