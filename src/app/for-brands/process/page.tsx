import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CampaignProcessDetailDashboard } from "@/components/brand/campaign-process-detail-dashboard";
import { buttonVariants } from "@/components/ui/button-variants";
import { campaignProcessDetailedSteps } from "@/lib/campaign-process-detailed-steps";
import { cn } from "@/lib/utils";

const processSteps = [
  {
    title: "1. 캠페인 세팅 및 결제",
    description:
      "브랜드가 직접 캠페인 목적, 방문 장소, 일정, 타겟 조건, 인원수를 선택하고 무통장입금 결제를 진행합니다.",
  },
  {
    title: "2. 가이드라인 확정",
    description:
      "브랜드 핵심 메시지, 촬영 포인트, 금지사항을 포함한 가이드라인을 확정해 실행 품질을 맞춥니다.",
  },
  {
    title: "3. 인플루언서 리스트 전달",
    description:
      "세팅 조건에 맞는 인플루언서 리스트를 전달하고, 브랜드 확인 후 최종 참여자를 확정합니다.",
  },
  {
    title: "4. 현장 방문 및 촬영",
    description:
      "확정된 일정에 맞춰 현장 방문과 촬영을 진행하며, 운영팀이 이슈 대응과 일정 관리를 함께 진행합니다.",
  },
  {
    title: "5. 업로드 관리",
    description: "방문 이후 업로드 일정과 콘텐츠 상태를 관리하고 누락/지연 없이 게시 완료를 지원합니다.",
  },
  {
    title: "6. 결과 보고",
    description: "업로드 링크와 핵심 성과를 정리한 리포트를 전달하고 다음 캠페인 개선 포인트를 제안합니다.",
  },
];

export default function BrandProcessPage() {
  return (
    <div className="relative min-h-dvh bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-[-100px] top-4 h-80 w-80 rounded-full bg-primary/6 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="brand-container flex flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/for-brands" className="text-lg font-semibold tracking-tight">
            <span className="text-primary">K-LINK</span>
            <span className="text-muted-foreground"> · 브랜드</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/for-brands" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
              메인홈
            </Link>
            <Link href="/services/visit-content" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
              서비스 설명
            </Link>
            <Link href="/campaign/setup" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
              캠페인 세팅하기
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}>
              캠페인 상담하기
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
              로그인 / 회원가입
            </Link>
          </div>
        </div>
      </header>

      <main className="brand-container brand-section relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">CAMPAIGN FLOW</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              브랜드사를 위한 캠페인 전체 프로세스
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              세팅부터 결제, 진행, 리포트까지 흐름이 한눈에 보이도록 설계했습니다.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/for-brands" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              메인페이지
            </Link>
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }))}>
              캠페인 세팅하기
            </Link>
          </div>
        </div>

        <section className="brand-panel-muted mt-10 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary">PROCESS TIMELINE</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {["세팅/결제", "가이드라인", "리스트 전달", "방문/촬영", "업로드", "결과보고"].map((item, index) => (
              <div key={item} className="rounded-lg bg-background px-4 py-3">
                <p className="text-xs text-muted-foreground">STEP {index + 1}</p>
                <p className="mt-1 text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="brand-timeline relative ml-1 pl-6 sm:pl-8">
            {processSteps.map((step, index) => (
              <div key={step.title} className="relative pb-10 last:pb-0">
                <span className="brand-timeline-dot absolute -left-[28px] top-1.5 inline-flex sm:-left-[37px]" />
                <p className="text-xs font-semibold text-primary">STEP {index + 1}</p>
                <h3 className="mt-1 font-heading text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-border/60 pt-12">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">OPERATIONS VIEW</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">6단계 운영 마이페이지</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              내비·KPI·일정 힌트를 한 화면에서 스캔할 수 있는 뷰입니다. 메인 페이지에서는 흐름만 보여 드리고, 상세는 이 페이지에 모았습니다.
            </p>
          </div>
          <CampaignProcessDetailDashboard steps={campaignProcessDetailedSteps} />

          <details className="group/details-text mt-10 overflow-hidden rounded-xl border border-border/80 bg-muted/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium transition hover:bg-muted/50 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span>단계별 원문 전체 보기</span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground transition group-open/details-text:rotate-180" aria-hidden />
            </summary>
            <div className="border-t border-border/80 bg-background px-4 py-6 sm:px-6">
              <ol className="space-y-10">
                {campaignProcessDetailedSteps.map((step) => (
                  <li key={step.title}>
                    <p className="font-heading text-lg font-semibold tracking-tight">{step.title}</p>
                    <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {step.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </details>
        </section>

        <section className="brand-panel-muted mt-12 p-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">브랜드사가 체감하는 핵심 포인트</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>프로세스 단계명이 세팅 화면과 동일해 담당자가 내부 공유하기 쉬움</li>
            <li>캠페인 세팅 및 결제 이후 진행 흐름이 명확해 다음 액션을 빠르게 판단</li>
            <li>리스트 전달, 방문/촬영, 업로드, 결과보고까지 전체 절차를 같은 용어로 관리</li>
            <li>단계별 커뮤니케이션 기준이 정리되어 운영 누락과 오해를 줄일 수 있음</li>
            <li>방문 첫날 2주 전 리스트 납품을 기본으로 하되, 불가 시 최소 7일 전 납품 기준으로 자동 조정</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }))}>
              지금 캠페인 세팅하기
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              회원가입하기
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
