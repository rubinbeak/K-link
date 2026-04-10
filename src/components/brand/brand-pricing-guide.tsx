import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandBudgetCalculator } from "@/components/brand/brand-budget-calculator";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const planCardClass =
  "flex h-full min-h-0 flex-col rounded-2xl border border-zinc-200/85 bg-white p-6 shadow-[0_22px_50px_-36px_rgba(15,23,42,0.28)] ring-1 ring-black/4 sm:p-8";

type BrandPricingGuideProps = {
  /** 첫 번째(플랜 비교) 섹션 상단 여백 — for-brands 기본 `mt-28` */
  plansSectionClassName?: string;
};

export function BrandPricingGuide({ plansSectionClassName = "mt-28" }: BrandPricingGuideProps) {
  return (
    <>
      <section className={cn("mx-auto w-full max-w-6xl px-1 sm:px-0", plansSectionClassName)}>
        <div className="w-full text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">요금 안내</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-600">
            팔로워 5천 이하·이상 인원을 섞어 합산할 수 있습니다. <br/> 캠페인 성공을 위한 세부 조건 협의도 가능합니다.
          </p>
        </div>

        <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 sm:gap-7 md:grid-cols-2">
          <article className={planCardClass} aria-labelledby="plan-standard-heading">
            <p className="text-xs font-semibold uppercase leading-normal tracking-[0.14em] text-fuchsia-600/90">STANDARD</p>
            <h3 id="plan-standard-heading" className="mt-3 font-heading text-lg font-semibold leading-snug text-zinc-900">
              팔로워 5천 이하
            </h3>
            <p className="mt-6 font-heading text-3xl font-black tracking-tight text-fuchsia-700 tabular-nums sm:text-4xl">
              250,000
              <span className="ml-1.5 text-base font-semibold text-fuchsia-600/85">원</span>
            </p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">VAT 별도</p>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-fuchsia-700">1인 기준 · 25만원</p>
            <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed text-zinc-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">거주 국가 추가금 없음 · 동일 단가로 글로벌 섭외 가능</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">방문 1회 및 지정 채널 콘텐츠 1회 업로드 체계</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">세팅 조건에 맞는 인플루언서 섭외·리스트 제안 및 확정 지원</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">가이드라인 정리, 일정 조율, 현장 방문·촬영까지 운영 동행</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">업로드 마감 관리 및 지연·누락 방지 지원</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-500" aria-hidden />
                <span className="min-w-0 flex-1">업로드 링크·핵심 성과를 정리한 캠페인 리포트 제공</span>
              </li>
            </ul>
            <div className="mt-8 flex shrink-0 justify-center sm:mt-10">
              <Link
                href="/campaign/setup"
                aria-label="STANDARD 플랜, 팔로워 5천 이하 25만원 VAT 별도. 캠페인 세팅으로 이동"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-11 min-h-11 w-full max-w-xs rounded-xl px-5 text-sm font-semibold whitespace-normal shadow-sm sm:h-12 sm:min-h-12 sm:px-6 sm:text-base",
                )}
              >
                <span className="flex items-center justify-center gap-2 text-center leading-snug">
                  캠페인 세팅에서 선택
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover/button:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </div>
          </article>

          <article className={planCardClass} aria-labelledby="plan-plus-heading">
            <p className="text-xs font-semibold uppercase leading-normal tracking-[0.14em] text-fuchsia-700/90">PLUS</p>
            <h3 id="plan-plus-heading" className="mt-3 font-heading text-lg font-semibold leading-snug text-zinc-900">
              팔로워 5천 이상
            </h3>
            <p className="mt-6 font-heading text-2xl font-bold tracking-tight text-zinc-900 tabular-nums sm:text-3xl">
              500,000
              <span className="ml-1.5 text-base font-semibold text-zinc-500">원</span>
            </p>
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">VAT 별도</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">1인 기준 (50만원)</p>
            <ul className="mt-8 flex-1 space-y-3 text-sm leading-relaxed text-zinc-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">팔로워 5천 이상 구간 인당 50만원 고정 단가</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">STANDARD와 동일한 전 과정 포함</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">더 넓은 도달을 전제로 한 크리에이터 매칭·일정 협의</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">일정 변경·현장 이슈 발생 시 운영팀 대응 지원</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">거주 국가 추가금 없음(동일 단가 기준)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-[calc(0.5lh-3px)] size-1.5 shrink-0 rounded-full bg-fuchsia-400" aria-hidden />
                <span className="min-w-0 flex-1">복수 채널·세부 조건·특약은 상담 시 별도 합의 가능</span>
              </li>
            </ul>
            <div className="mt-8 flex shrink-0 justify-center sm:mt-10">
              <Link
                href="/campaign/setup"
                aria-label="PLUS 플랜, 팔로워 5천 이상 50만원 VAT 별도. 캠페인 세팅으로 이동"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-11 min-h-11 w-full max-w-xs rounded-xl px-5 text-sm font-semibold whitespace-normal shadow-sm sm:h-12 sm:min-h-12 sm:px-6 sm:text-base",
                )}
              >
                <span className="flex items-center justify-center gap-2 text-center leading-snug">
                  캠페인 세팅에서 선택
                  <ArrowRight className="size-4 shrink-0 transition-transform group-hover/button:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </div>
          </article>
        </div>
        <p className="mx-auto mt-12 max-w-2xl text-center text-xs leading-relaxed text-zinc-500">
          금액은 부가세(VAT) 별도이며, 위 단가 외 조정이 필요한 경우 별도 합의 후 반영됩니다.
        </p>
      </section>

      <section className="mx-auto mt-20 w-full max-w-6xl">
        <BrandBudgetCalculator />
      </section>
    </>
  );
}
