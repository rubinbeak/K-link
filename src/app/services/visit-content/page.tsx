import Link from "next/link";
import { BrandPricingGuide } from "@/components/brand/brand-pricing-guide";
import { VisitContentProcessTimeline } from "@/components/services/visit-content-process-timeline";
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
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            <span className="block">프로세스를 알면</span>
            <span className="mt-3 block sm:mt-5">캠페인 준비가 쉬워집니다</span>
          </h1>
          <p className="mt-6 text-pretty text-muted-foreground">
            이 페이지는 방문형 캠페인의 전체 흐름을 빠르게 이해할 수 있도록 구성했습니다.
            <br className="hidden sm:block" />
            세팅부터 결과 전달까지, 실제 진행 순서를 간단히 확인해보세요.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-5xl">
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-5">
            {[
              "방문형 캠페인 전용 운영",
              "인플루언서 섭외부터 업로드까지 일괄 진행",
              "일정 변경 및 현장 이슈 대응",
              "캠페인별 리포트 전달",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base font-medium text-foreground sm:text-lg">
                <span className="mt-0.5 shrink-0 text-primary">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <VisitContentProcessTimeline simpleSteps={processSteps} />

        <p className="mx-auto mt-16 max-w-3xl text-center text-pretty text-sm font-medium text-foreground/85 sm:text-base">
          성과 리포트는 별도의 보고서 또는 문서로 제공됩니다
        </p>

        <BrandPricingGuide plansSectionClassName="mt-16" />

        <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-fuchsia-50 to-white px-5 py-10 text-center sm:px-8 sm:py-12">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">NEXT STEP</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-[2rem] md:leading-snug">
            서비스를 이해하셨다면, 이제 캠페인 세팅을 시작하세요
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base font-semibold leading-snug text-foreground/90 sm:text-lg">
            바로 세팅을 진행하거나 상담을 통해 맞춤 제안을 받아보세요.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/campaign/setup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full min-w-[200px] justify-center sm:w-auto",
              )}
            >
              캠페인 세팅하기
            </Link>
            <Link
              href="/consulting"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full min-w-[200px] justify-center border-primary/25 bg-white/80 backdrop-blur-sm sm:w-auto",
              )}
            >
              캠페인 상담받기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
