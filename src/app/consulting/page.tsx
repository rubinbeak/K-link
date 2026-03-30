import Link from "next/link";
import { LeadForm } from "@/components/consulting/lead-form";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function ConsultingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-0 top-56 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-pink-300/20 blur-2xl" />
      </div>
      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/for-brands" className="text-sm text-muted-foreground hover:text-foreground">
            ← 브랜드 페이지
          </Link>
          <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }))}>
            캠페인 세팅하기
          </Link>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-14">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            빠른 상담 접수
          </span>
          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-6xl">캠페인 상담하기</h1>
          <p className="mt-5 text-muted-foreground">
            상황에 맞는 채널을 선택하면 운영팀이 빠르게 상담을 도와드립니다.
          </p>
        </section>

        <section className="mx-auto mt-8 grid max-w-4xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-center shadow-sm shadow-pink-100/40">평균 1영업일 내 응답</div>
          <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-center shadow-sm shadow-pink-100/40">국가/업종별 운영 제안</div>
          <div className="rounded-xl border border-border/70 bg-background/80 px-4 py-3 text-center shadow-sm shadow-pink-100/40">예산·일정 맞춤 설계</div>
        </section>

        <section className="mx-auto mt-8 max-w-5xl">
          <MiniVisualMotif
            title="상담 진행 인사이트"
            description="문의 접수부터 제안서 전달까지 동일한 리듬으로 빠르게 안내해드립니다."
          />
        </section>

        <section className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-lg shadow-pink-100/40 backdrop-blur-md">
            <h2 className="font-heading text-lg font-semibold">빠른 상담 채널</h2>
            <a
              href="https://pf.kakao.com"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              카카오톡 비즈 채널 열기
            </a>
            <div className="rounded-xl border border-border/70 bg-background/80 p-3">
              <p className="text-sm text-muted-foreground">화상 미팅 예약 (Google Calendar)</p>
              <iframe
                title="meeting-calendar"
                src="https://calendar.google.com/calendar/embed?showTitle=0&showNav=1"
                className="mt-2 h-64 w-full rounded-md border border-border"
              />
            </div>
          </div>
          <LeadForm />
        </section>
      </main>
    </div>
  );
}
