import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, GitBranch, Globe2, LineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { brandPrimaryCtaLabel, brandServiceOutlineLabel } from "@/lib/brand-marketing-copy";
import { cn } from "@/lib/utils";

const pillars: readonly { title: string; sub: string; Icon: LucideIcon }[] = [
  {
    title: "국가별 에이전시 · 현지 파트너",
    sub: "권역별 로컬 파트너와 함께 섭외·일정·현장 이슈까지 한 팀처럼 맞춥니다.",
    Icon: Globe2,
  },
  {
    title: "업종을 가로지르는 실무 역량",
    sub: "뷰티·F&B·의료·문화 어디든 가이드라인을 현장 기준으로 정리합니다.",
    Icon: Compass,
  },
  {
    title: "데이터가 받쳐 주는 방문 캠페인",
    sub: "누적 프로필과 매칭 시그널로 후보군을 빠르게 좁힙니다.",
    Icon: LineChart,
  },
  {
    title: "한 줄로 이어지는 운영",
    sub: "세팅부터 보고까지 단계 명칭이 제품·문서에서 통일됩니다.",
    Icon: GitBranch,
  },
] as const;

const industries = [
  "뷰티 · 코스메틱",
  "식품 · F&B",
  "병원 · 클리닉",
  "예술 · 전시 · 컬처",
  "패션 · 리테일",
  "팝업 · 행사 · 런칭",
] as const;

/** flagcdn ISO 3166-1 alpha-2 (eu = 유럽연합) */
const regions = [
  { iso: "us", code: "US", name: "미국" },
  { iso: "jp", code: "JP", name: "일본" },
  { iso: "cn", code: "CN", name: "중국" },
  { iso: "sg", code: "SG", name: "동남아" },
  { iso: "eu", code: "EU", name: "유럽" },
  { iso: "ae", code: "AE", name: "중동" },
  { iso: "kr", code: "KR", name: "한국" },
  { iso: "mx", code: "MX", name: "멕시코" },
] as const;

export function BrandWhyKlinkCta() {
  return (
    <section className="relative mt-20 px-3 sm:mt-28 sm:px-6" aria-labelledby="why-klink-heading">
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">WHY K-LINK</p>
          <h2
            id="why-klink-heading"
            className="mt-3 text-balance font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
          >
            왜 K-LINK인가요? 
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
            글로벌 현지망·업종 경험·데이터와 프로세스가 한데 모여{" "}<br/>
            <span className="font-medium text-zinc-800">방문형 캠페인을 </span>맡겨도 되는 일로 만듭니다.
          </p>
        </div>

        <div className="mx-auto mt-12 grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:gap-x-12">
          {pillars.map(({ title, sub, Icon }) => (
            <div key={title} className="flex gap-4 text-left">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary shadow-inner shadow-primary/5">
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-heading text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-5xl border-t border-fuchsia-200/40 pt-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500">협력 가능 업종</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {industries.map((label) => (
                  <span
                    key={label}
                    className="inline-flex min-w-0 items-center justify-center rounded-full border border-fuchsia-200/50 bg-white/40 px-2 py-1.5 text-center text-xs font-medium leading-snug text-zinc-800 backdrop-blur-[2px] sm:px-3 sm:text-sm sm:leading-normal"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="min-w-0 shrink-0 lg:max-w-md">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500">글로벌 권역</p>
              <div
                className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
                aria-label="운영 권역 국기와 국가명"
              >
                {regions.map((region) => (
                  <span
                    key={region.code}
                    className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-fuchsia-200/40 bg-white/35 px-2 py-1.5 text-xs font-medium text-zinc-800 backdrop-blur-[2px]"
                  >
                    <Image
                      src={`https://flagcdn.com/24x18/${region.iso}.png`}
                      alt={`${region.name} 국기`}
                      width={24}
                      height={18}
                      className="h-3.5 w-[1.1rem] shrink-0 rounded-[2px] border border-zinc-200/90 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                    />
                    <span className="tabular-nums">{region.code}</span>
                    <span className="truncate text-zinc-500">{region.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
              <div className="mx-auto flex max-w-xl flex-col items-center">
                <p className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-fuchsia-100">
                  오늘 세팅하면 견적이 바로 보입니다
                </p>
                <p className="mt-5 font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
                  브랜드 현장을 콘텐츠로 연결할 준비 되셨나요?
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  임시 저장으로 천천히 채우셔도 됩니다. 맞춤 조건이 필요하면 상담으로 먼저 정리해 드립니다.
                </p>
                <div className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:mx-auto sm:max-w-xl">
                  <Link
                    href="/campaign/setup"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "group w-full border-0 bg-white font-semibold text-fuchsia-700 shadow-sm transition hover:bg-zinc-50 hover:text-fuchsia-800",
                    )}
                  >
                    <span className="flex items-center justify-center gap-2 text-center text-sm leading-snug sm:text-base">
                      {brandPrimaryCtaLabel}
                      <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                  <Link
                    href="/services/visit-content"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "w-full border-white/40 bg-white/10 font-medium text-white backdrop-blur-sm hover:bg-white/15 hover:text-white",
                    )}
                  >
                    {brandServiceOutlineLabel}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
