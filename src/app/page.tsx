import Link from "next/link";
import { auth } from "@/auth";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-20 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
      </div>
      <header className="relative border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-primary">K-LINK</span>
          </span>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <Link
                href={
                  session.user.role === "BRAND"
                    ? "/brand"
                    : session.user.role === "INFLUENCER"
                      ? "/influencer/feed"
                      : "/admin"
                }
                className={cn(buttonVariants({ size: "sm" }))}
              >
                대시보드
              </Link>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            방문형 콘텐츠 캠페인 플랫폼
          </span>
          <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
            브랜드와 인플루언서를
            <br className="hidden sm:block" /> 가장 빠르게 연결합니다
          </h1>
          <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
            브랜드는 캠페인을 만들고, 인플루언서는 지원하고, 운영팀은 전체 과정을 관리합니다.
            <br className="hidden sm:block" />
            입구는 분리되어도 운영 데이터는 하나로 연결됩니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">브랜드 전용 페이지</span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">크리에이터 다국어 페이지</span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">통합 운영 대시보드</span>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <MiniVisualMotif
              title="플랫폼 실시간 흐름"
              description="브랜드 등록부터 인플루언서 업로드까지 한눈에 파악할 수 있습니다."
            />
          </div>
          <Card className="rounded-3xl border-border/70 bg-card/85 shadow-xl shadow-pink-100/50 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl">브랜드 담당자</CardTitle>
              <CardDescription className="text-pretty text-base leading-relaxed">
                캠페인 등록부터 결제, 지원자 선정, 결과 확인까지 한국어로 쉽고 빠르게 진행할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/for-brands" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                브랜드 페이지 보기
              </Link>
              <p className="text-xs text-muted-foreground">서비스 소개, 요금, 캠페인 세팅 바로가기</p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 bg-card/85 shadow-xl shadow-pink-100/50 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="font-heading text-xl">크리에이터 / 인플루언서</CardTitle>
              <CardDescription className="text-pretty text-base leading-relaxed">
                영어, 한국어, 중국어, 일본어로 참여 방법을 확인하고, 캠페인 지원 흐름을 바로 이해할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/creators" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                크리에이터 페이지 보기
              </Link>
              <p className="text-xs text-muted-foreground">다국어 안내 및 참여 동선 제공</p>
            </CardContent>
          </Card>
        </div>

        <p className="mt-14 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </main>

      <footer className="relative border-t border-border/50 bg-background/60 py-8 text-center text-xs text-muted-foreground backdrop-blur-xl">
        K-LINK · Next.js · Prisma · NextAuth
      </footer>
    </div>
  );
}
