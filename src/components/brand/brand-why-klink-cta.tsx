import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { brandPrimaryCtaLabel, brandServiceOutlineLabel } from "@/lib/brand-marketing-copy";
import { cn } from "@/lib/utils";

const pillars = [
  {
    emoji: "🌍",
    title: "국가별 에이전시 · 현지 파트너",
    body:
      "미국·일본·중국·동남아·유럽·중동 등 권역별 모델 에이전시와 현지 파트너 네트워크를 함께 씁니다. 현지 섭외·일정 조율·현장 이슈 대응까지 ‘거기에 있는 팀’처럼 맞춰 드립니다.",
  },
  {
    emoji: "🧭",
    title: "업종을 가로지르는 실무 역량",
    body:
      "뷰티·코스메틱, 식품·F&B, 병원·클리닉, 예술·전시·문화 행사까지 다양한 브랜드와 협업해 왔습니다. 톤가이드·촬영 제약·민감 카테고리도 현장 기준으로 정리해 실행 품질을 맞춥니다.",
  },
  {
    emoji: "📈",
    title: "데이터가 받쳐 주는 방문 캠페인",
    body:
      "누적 관리되는 대규모 크리에이터 데이터와 매칭 시그널로 후보군을 빠르게 좁힙니다. ‘감’이 아니라 조건·성과 힌트를 함께 보고 결정할 수 있습니다.",
  },
  {
    emoji: "⚙️",
    title: "한 줄로 이어지는 운영",
    body:
      "세팅·결제·가이드라인·리스트·방문·업로드·보고까지 단계 이름이 서비스와 문서에서 통일되어 있습니다. 내부 보고·재집행·파트너 공유 시 말이 끊기지 않습니다.",
  },
] as const;

const industries = [
  { emoji: "💄", label: "뷰티 · 코스메틱" },
  { emoji: "🍱", label: "식품 · F&B" },
  { emoji: "🏥", label: "병원 · 클리닉" },
  { emoji: "🎨", label: "예술 · 전시 · 컬처" },
  { emoji: "🛍️", label: "패션 · 리테일" },
  { emoji: "✨", label: "팝업 · 행사 · 런칭" },
] as const;

const regionFlags = [
  { flag: "🇺🇸", code: "US", name: "미국" },
  { flag: "🇯🇵", code: "JP", name: "일본" },
  { flag: "🇨🇳", code: "CN", name: "중국" },
  { flag: "🇸🇬", code: "SG", name: "동남아" },
  { flag: "🇪🇺", code: "EU", name: "유럽" },
  { flag: "🇦🇪", code: "AE", name: "중동" },
  { flag: "🇰🇷", code: "KR", name: "한국" },
  { flag: "🇲🇽", code: "MX", name: "중남미" },
] as const;

export function BrandWhyKlinkCta() {
  return (
    <section className="relative mt-20 px-1 sm:mt-28 sm:px-0" aria-labelledby="why-klink-heading">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-zinc-50/40 p-6 sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute -right-12 top-0 h-36 w-36 rounded-full bg-fuchsia-400/8 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-16 h-32 w-32 rounded-full bg-rose-300/10 blur-2xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary">WHY K-LINK</p>
          <h2
            id="why-klink-heading"
            className="mt-3 text-balance font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl"
          >
            왜 K-LINK여야 할까요?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
            글로벌 현지 네트워크와 업종별 실행 경험, 그리고 데이터·프로세스가 한데 모여{" "}
            <span className="font-medium text-zinc-800">방문형 캠페인을 ‘맡겨도 되는 일’</span>로 만듭니다. 브랜드는 메시지와 현장에 집중하고,
            나머지는 저희가 짚어 드립니다.
          </p>
        </div>

        <div className="relative mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:gap-5">
          {pillars.map((item) => (
            <div key={item.title} className="flex flex-col rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xl"
                  aria-hidden
                >
                  {item.emoji}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-heading text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto mt-10 max-w-5xl rounded-xl border border-zinc-200/90 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500">협력 가능 업종</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {industries.map((row) => (
                  <span
                    key={row.label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/90 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 sm:text-sm"
                  >
                    <span aria-hidden>{row.emoji}</span>
                    {row.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 border-t border-zinc-200/80 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500">글로벌 권역</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="운영 권역 국기와 국가명">
                {regionFlags.map((region) => (
                  <span
                    key={region.code}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700"
                  >
                    <span aria-hidden>{region.flag}</span>
                    <span>{region.code}</span>
                    <span className="text-zinc-500">{region.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
              <div className="mx-auto flex max-w-xl flex-col items-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-fuchsia-100 ring-1 ring-white/15">
                  <Sparkles className="size-3.5 text-amber-200" aria-hidden />
                  오늘 세팅하면 견적이 바로 보입니다
                </span>
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
                <Link
                  href="/signup"
                  className="mt-5 text-sm font-medium text-fuchsia-200/90 underline-offset-4 transition hover:text-white hover:underline"
                >
                  아직 계정이 없다면 브랜드 회원가입
                </Link>
                <p className="mt-6 text-[11px] leading-relaxed text-zinc-500">
                  무통장입금 확정 후 착수 · 단계별 상태는 세팅 화면과 동일 용어로 안내
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
