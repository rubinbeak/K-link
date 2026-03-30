import Link from "next/link";
import { auth } from "@/auth";
import { BrandBudgetCalculator } from "@/components/brand/brand-budget-calculator";
import { BrandInsightPanels } from "@/components/visual/brand-insight-panels";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function ForBrandsPage() {
  const session = await auth();

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-[-120px] top-0 h-80 w-80 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>
      <header className="relative border-b border-border/50 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            <span className="text-primary">K-LINK</span>
            <span className="text-muted-foreground"> · 브랜드</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/services/visit-content"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              서비스 설명
            </Link>
            <Link
              href="/campaign/setup"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              캠페인 세팅하기
            </Link>
            <Link
              href="/consulting"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              캠페인 상담하기
            </Link>
            <Link
              href="/creators"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              크리에이터 안내
            </Link>
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

      <main className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            브랜드 전용 운영 페이지
          </span>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-6xl">
            방문형 콘텐츠 캠페인,
            <br className="hidden sm:block" /> 한 번에 운영하세요
          </h1>
          <p className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg">
            인플루언서 섭외부터 현장 방문, 업로드 관리, 결과 보고까지 한 흐름으로 관리합니다.
            <br className="hidden sm:block" />
            복잡한 커뮤니케이션은 줄이고 실행 속도는 높여드립니다.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">전세계 방문형 캠페인</span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">일정/업로드/리포트 통합 관리</span>
            <span className="rounded-full border border-border/70 bg-background/80 px-2.5 py-1">운영팀 협업 최적화</span>
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }))}>
              캠페인 세팅하기
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              캠페인 상담하기
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { n: "100,000+", t: "검증된 글로벌 인플루언서 데이터" },
            { n: "24h~72h", t: "초기 섭외 시작 속도" },
            { n: "7일", t: "방문 후 업로드 관리 기준" },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-border/70 bg-card/85 px-5 py-4 text-center shadow-lg shadow-pink-100/40 backdrop-blur-md"
            >
              <p className="text-2xl font-semibold tracking-tight text-primary">{item.n}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.t}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <MiniVisualMotif
            title="브랜드 캠페인 리듬"
            description="섭외, 방문, 업로드 진행률을 같은 톤의 카드로 빠르게 확인합니다."
          />
        </section>

        <section className="mt-16 sm:mt-20">
          <div className="mb-6 text-center">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">운영 인사이트 미리보기</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              실시간 대시보드처럼 핵심 지표를 직관적으로 확인할 수 있습니다.
            </p>
          </div>
          <BrandInsightPanels />
        </section>

        <section className="mt-20 sm:mt-28">
          <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">진행 방식</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "캠페인 등록",
                d: "목적, 장소, 일정, 타깃 조건을 입력하면 즉시 운영 준비가 시작됩니다.",
              },
              {
                t: "섭외·선정 진행",
                d: "지원자 프로필을 확인하고 적합한 인플루언서를 선별해 빠르게 확정합니다.",
              },
              {
                t: "결과 보고",
                d: "업로드 상태와 결과 링크를 모아 한눈에 확인할 수 있는 리포트로 정리합니다.",
              },
            ].map((item) => (
              <Card
                key={item.t}
                className="rounded-2xl border-border/70 bg-card/80 text-left shadow-lg shadow-pink-100/50 backdrop-blur-md"
              >
                <CardHeader>
                  <CardTitle className="font-heading text-lg">{item.t}</CardTitle>
                  <CardDescription className="text-pretty leading-relaxed">{item.d}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-pink-100 via-fuchsia-50 to-white p-6 shadow-xl shadow-pink-100/60">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary">OPERATING COVERAGE</p>
            <h3 className="mt-3 font-heading text-2xl font-semibold tracking-tight">가능 국가 및 현지 네트워크</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              미국, 일본, 중국, 동남아, 유럽, 중동 등 주요 권역에서 현지 파트너와 함께 방문형 캠페인을 운영합니다.
            </p>
            <div className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              {["미국", "일본", "중국", "동남아", "유럽", "중동"].map((region) => (
                <div key={region} className="rounded-xl border border-white/80 bg-white/70 px-3 py-2">
                  {region}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card/85 p-6 shadow-xl shadow-pink-100/50 backdrop-blur-md">
            <h3 className="font-heading text-xl font-semibold tracking-tight">운영 가능한 방문형 카테고리</h3>
            <div className="mt-4 grid gap-2 text-sm">
              {["매장", "팝업스토어", "행사 / 부스", "병원 / 클리닉", "쇼룸 / 전시", "레스토랑 / F&B"].map((category) => (
                <div key={category} className="rounded-lg border border-border/70 bg-background/70 px-3 py-2">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20">
          <BrandBudgetCalculator />
        </section>

        <section className="mt-20">
          <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">레퍼런스 콘텐츠 스타일</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "매장 체험형 브이로그",
                tag: "Tokyo / Beauty Store",
                href: "https://www.pexels.com/video/woman-holding-cosmetic-products-3762888/",
                image: "https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=1200",
              },
              {
                title: "팝업 오프닝 숏폼",
                tag: "Seoul / Pop-up Event",
                href: "https://www.pexels.com/video/woman-applying-makeup-3762871/",
                image: "https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=1200",
              },
              {
                title: "클리닉 방문 후기",
                tag: "Bangkok / Clinic",
                href: "https://www.pexels.com/video/woman-testing-skincare-product-5938588/",
                image: "https://images.pexels.com/photos/5938595/pexels-photo-5938595.jpeg?auto=compress&cs=tinysrgb&w=1200",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-border/70 bg-card/85 p-3 shadow-lg shadow-pink-100/40 backdrop-blur-md"
              >
                <div className="relative overflow-hidden rounded-xl border border-white/70">
                  <div
                    className="h-40 bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div>
                      <p className="text-xs font-semibold text-pink-100">{item.tag}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <span className="mt-2 inline-block rounded-full border border-white/40 bg-white/20 px-2 py-1 text-xs text-white">
                      재생
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center font-heading text-2xl font-semibold tracking-tight">요금 안내</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Card className="rounded-2xl border-border/70 bg-card/85 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">기본 단가</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  1명 기준 250,000원
                  <br />
                  거주 국가 추가금 없음
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/85 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">팔로워 5천 ~ 3만</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  1인당 100,000원 추가
                  <br />
                  중형 크리에이터 구간
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-border/70 bg-card/85 shadow-lg shadow-pink-100/40 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg">팔로워 3만+</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  1인당 200,000원 추가
                  <br />
                  대형 크리에이터 구간
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-primary/25 bg-linear-to-r from-primary/10 via-pink-50 to-fuchsia-100/60 px-6 py-10 sm:mt-28">
          <h2 className="text-center font-heading text-xl font-semibold tracking-tight">K-LINK를 선택하는 이유</h2>
          <ul className="mx-auto mt-6 max-w-2xl list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>브랜드·크리에이터·운영팀이 같은 데이터를 보며 협업하는 통합 구조</li>
            <li>캠페인 단계별 상태를 명확히 확인할 수 있어 일정 누락을 줄일 수 있음</li>
            <li>결제, 선정, 업로드, 보고까지 끊김 없이 이어지는 운영 플로우</li>
          </ul>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }))}>
              지금 캠페인 세팅하기
            </Link>
            <Link href="/consulting" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
              운영팀에 상담 요청하기
            </Link>
          </div>
        </section>

        <footer className="mt-16 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          <p>© K-LINK. 문의 및 제휴는 로그인 후 내부 채널 또는 별도 안내에 따릅니다.</p>
          <p className="mt-2">크리에이터 대상 글로벌 안내는 다국어 페이지에서 확인할 수 있습니다.</p>
        </footer>
      </main>
    </div>
  );
}
