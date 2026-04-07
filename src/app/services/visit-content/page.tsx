import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function VisitContentServicePage() {
  const processSteps = [
    {
      title: "1. 캠페인 세팅 및 결제",
      body: "브랜드 정보와 방문 조건을 입력하고 결제를 완료하면 캠페인이 확정됩니다.",
    },
    {
      title: "2. 가이드라인 확정",
      body: "핵심 메시지와 촬영 기준을 정리해 참여자 모두가 같은 기준으로 움직입니다.",
    },
    {
      title: "3. 인플루언서 섭외 및 확정",
      body: "세팅 조건에 맞는 인플루언서 리스트를 전달하고, 브랜드 확인 후 최종 참여자를 확정합니다.",
    },
    {
      title: "4. 현장 방문 및 촬영",
      body: "확정된 일정에 맞춰 현장 방문과 촬영을 진행하며, 운영팀이 이슈 대응과 일정 관리를 함께 진행합니다.",
    },
    {
      title: "5. 업로드 관리",
      body: "방문 이후 업로드 일정과 콘텐츠 상태를 관리하고 누락/지연 없이 게시 완료를 지원합니다.",
    },
    {
      title: "6. 결과 보고",
      body: "업로드 링크와 핵심 성과를 정리한 리포트를 전달하고 다음 캠페인 개선 포인트를 제안합니다.",
    },
  ] as const;

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-6xl px-4 py-14">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            방문형 콘텐츠 서비스
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            프로세스를 알면,
            <br className="hidden sm:block" /> 캠페인 준비가 쉬워집니다
          </h1>
          <p className="mt-6 text-pretty text-muted-foreground">
            이 페이지는 방문형 캠페인의 전체 흐름을 빠르게 이해할 수 있도록 구성했습니다.
            <br className="hidden sm:block" />
            세팅부터 결과 전달까지, 실제 진행 순서를 간단히 확인해보세요.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-4xl">
          <ul className="space-y-3">
            {[
              "방문형 캠페인 전용 운영",
              "인플루언서 섭외부터 업로드까지 일괄 진행",
              "일정 변경 및 현장 이슈 대응",
              "캠페인별 리포트 전달",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-base font-medium text-foreground sm:text-lg">
                <span className="text-primary">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-pink-50 to-fuchsia-100/60 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">PROCESS TIMELINE</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {["세팅/결제", "가이드라인", "리스트 전달", "방문/촬영", "업로드", "결과보고"].map((item, index) => (
              <div key={item} className="rounded-lg bg-white/70 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground">STEP {index + 1}</p>
                <p className="mt-1 text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>

          <div className="brand-timeline relative mt-10 ml-1 pl-6 sm:pl-8">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative pb-10 last:pb-0">
                <span className="brand-timeline-dot absolute -left-[28px] top-1.5 inline-flex sm:-left-[37px]" />
                <p className="text-xs font-semibold text-primary">STEP {index + 1}</p>
                <h3 className="mt-1 font-heading text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(236,72,153,0.35)] sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-fuchsia-200/40 blur-3xl" />
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">REPORT DELIVERY</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">성과 전달 방식</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              성과 리포트는 페이지 내 화면이 아닌 별도 노션 페이지 또는 보고서 문서로 전달됩니다.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">요금 정책</h2>
            <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600">
              팔로워 5천 이하·이상 인원을 섞어 합산할 수 있으며, 추가 조정은 별도 협의합니다.
            </p>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-zinc-50/30 px-6 py-10 sm:px-10 sm:py-12">
            <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-fuchsia-400/8 blur-2xl" aria-hidden />
            <div className="pointer-events-none absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-rose-300/10 blur-2xl" aria-hidden />
            <div className="relative grid gap-6 md:grid-cols-2 md:items-stretch lg:gap-8">
              <article className="flex flex-col rounded-xl border border-zinc-200/90 bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-600/90">Standard</p>
                <h3 className="mt-2 font-heading text-lg font-semibold text-zinc-900">팔로워 5천 이하</h3>
                <p className="mt-5 font-heading text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  250,000
                  <span className="ml-1.5 text-base font-semibold text-zinc-500">원</span>
                </p>
                <p className="mt-3 text-sm text-zinc-600">1인 기준 (25만원)</p>
              </article>
              <article className="flex flex-col rounded-xl border-2 border-primary/35 bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-700">Plus</p>
                <h3 className="mt-2 font-heading text-lg font-semibold text-zinc-900">팔로워 5천 이상</h3>
                <p className="mt-5 font-heading text-2xl font-bold tracking-tight text-fuchsia-700 sm:text-3xl">
                  500,000
                  <span className="ml-1.5 text-base font-semibold text-fuchsia-600/85">원</span>
                </p>
                <p className="mt-3 text-sm text-zinc-600">1인 기준 (50만원)</p>
              </article>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-fuchsia-50 to-white p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.12em] text-primary">NEXT STEP</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">서비스를 이해하셨다면, 이제 캠페인 세팅을 시작하세요</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            바로 세팅을 진행하거나 상담을 통해 맞춤 제안을 받아보세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }))}>
              캠페인 세팅하기
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              캠페인 상담받기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
