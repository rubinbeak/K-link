import Link from "next/link";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function VisitContentServicePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-[-80px] top-28 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/for-brands" className="text-sm text-muted-foreground hover:text-foreground">
            ← 브랜드 페이지
          </Link>
          <div className="flex gap-2">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "sm" }))}>
              캠페인 세팅하기
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              캠페인 상담하기
            </Link>
          </div>
        </div>
      </header>
      <main className="relative mx-auto max-w-6xl px-4 py-14">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            방문형 콘텐츠 서비스
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
            현장 방문이 필요한 캠페인,
            <br className="hidden sm:block" /> 실행부터 보고까지 맡겨주세요
          </h1>
          <p className="mt-6 text-pretty text-muted-foreground">
            매장, 팝업스토어, 행사, 쇼룸 등 방문이 핵심인 캠페인을 전문적으로 운영합니다.
            <br className="hidden sm:block" />
            섭외·일정 조율·업로드 관리·결과 보고를 한 흐름으로 제공합니다.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-4xl">
          <MiniVisualMotif
            title="서비스 운영 템포"
            description="섭외, 방문, 업로드 단계의 핵심 상태를 같은 시각 언어로 보여드립니다."
          />
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          {[
            "국가/언어/업종 기준 인플루언서 섭외",
            "현장 방문 일정 조율 및 변경 대응",
            "콘텐츠 가이드라인 제작·전달",
            "업로드 일정 관리 및 상태 체크",
            "캠페인 결과 보고서 전달",
            "콘텐츠 2차 활용 가능",
          ].map((item, index) => (
            <Card key={item} className="rounded-2xl border-border/70 bg-card/85 shadow-lg shadow-pink-100/45 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base">
                  <span className="mr-2 text-primary">0{index + 1}</span>
                  {item}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-pink-50 to-fuchsia-100/60 p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-semibold">기본 진행 순서</h2>
          <ol className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <li>1. 캠페인 세팅 및 결제</li>
            <li>2. 가이드라인 확정</li>
            <li>3. 인플루언서 리스트 전달</li>
            <li>4. 현장 방문 및 촬영</li>
            <li>5. 업로드 관리</li>
            <li>6. 결과 보고</li>
          </ol>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-lg shadow-pink-100/40 backdrop-blur-md">
            <h2 className="font-heading text-2xl font-semibold">성과 그래프 예시</h2>
            <p className="mt-2 text-sm text-muted-foreground">캠페인 종료 후 이런 형태의 성과 비교 리포트를 제공합니다.</p>
            <div className="mt-6 space-y-4">
              {[
                { label: "조회수 달성률", value: 88, color: "bg-primary" },
                { label: "참여율 달성률", value: 73, color: "bg-fuchsia-400" },
                { label: "방문 전환률", value: 64, color: "bg-pink-400" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{metric.label}</span>
                    <span>{metric.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted">
                    <div className={`h-2.5 rounded-full ${metric.color}`} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-lg shadow-pink-100/40 backdrop-blur-md">
            <h2 className="font-heading text-2xl font-semibold">캠페인 무드보드</h2>
            <p className="mt-2 text-sm text-muted-foreground">브랜드 톤에 맞춘 촬영 가이드 샘플을 시각적으로 공유합니다.</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {["뷰티존", "팝업존", "포토존", "체험존"].map((label, index) => (
                <div
                  key={label}
                  className="relative h-24 overflow-hidden rounded-xl border border-white/70 bg-linear-to-br from-white via-pink-100 to-fuchsia-100 p-3"
                >
                  <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-fuchsia-300/45 blur-xl" />
                  <p className="relative text-xs font-semibold text-primary">Sample 0{index + 1}</p>
                  <p className="relative mt-1 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-heading text-2xl font-semibold">요금 정책</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border-border/70 bg-card/80 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle>기본가</CardTitle>
                <CardDescription>1명 기준 250,000원 / 국가 추가금 없음</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/80 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle>팔로워 5천~3만</CardTitle>
                <CardDescription>1인당 +100,000원</CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/80 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle>팔로워 3만+</CardTitle>
                <CardDescription>1인당 +200,000원</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
