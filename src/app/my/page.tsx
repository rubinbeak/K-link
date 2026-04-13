import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircleMore, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { BrandMyCampaignsCarousel } from "@/components/brand/brand-my-campaigns-carousel";
import { buttonVariants } from "@/components/ui/button-variants";
import { getBrandCampaignCarouselItems } from "@/lib/brand-campaign-carousel-data";
import { cn } from "@/lib/utils";

export default async function MyPage() {
  const session = await auth();
  const user = session?.user;

  const brandCarouselItems =
    user?.role === "BRAND" && user.id ? await getBrandCampaignCarouselItems(user.id) : [];

  return (
    <main className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-4xl px-4 py-12">
      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="relative border-b border-zinc-100 bg-linear-to-r from-fuchsia-50/80 via-white to-sky-50/70 p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-fuchsia-200/30 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">My Page</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-zinc-900">환영합니다. 이제 시작해 볼까요?</h1>
          <p className="mt-2 text-sm text-zinc-600">
            {user ? `${user.name ?? user.email ?? "회원"} 님의 마이페이지입니다.` : "로그인 후 마이페이지에서 캠페인 실행을 시작할 수 있습니다."}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {!user ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                현재 로그인되어 있지 않습니다. 로그인 후 캠페인 세팅, 상담, 마이페이지 기능을 이용할 수 있습니다.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/login?callbackUrl=/my" className={cn(buttonVariants({ size: "lg" }))}>
                  로그인/회원가입
                </Link>
                <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  브랜드 소개로 이동
                </Link>
              </div>
            </>
          ) : (
            <>
              {user.role === "BRAND" ? (
                <>
                  {brandCarouselItems.length > 0 ? (
                    <div className="mb-6 flex w-full justify-center">
                      <BrandMyCampaignsCarousel campaigns={brandCarouselItems} compact className="w-full max-w-md" />
                    </div>
                  ) : null}

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <article className="rounded-xl border border-zinc-200/90 bg-zinc-50/50 p-5">
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-zinc-500">
                        <Sparkles className="size-3.5 text-fuchsia-600" />
                        CAMPAIGN STATUS
                      </p>
                      {brandCarouselItems.length === 0 ? (
                        <>
                          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">아직 진행 중인 캠페인이 없습니다.</h2>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            첫 캠페인만 시작하면 세팅, 결제, 진행, 결과 보고까지
                            <br />
                            한 흐름으로 관리할 수 있습니다.
                          </p>
                        </>
                      ) : (
                        <>
                          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">진행 중인 캠페인이 있습니다.</h2>
                          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                            위 카드에서 요약을 확인할 수 있습니다. 추가 캠페인이 필요하면 아래에서 시작해 주세요.
                          </p>
                        </>
                      )}
                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }), "justify-between")}>
                          캠페인 세팅하기
                          <ArrowRight className="size-4" />
                        </Link>
                        <Link href="/consulting" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-between")}>
                          캠페인 상담하기
                          <MessageCircleMore className="size-4" />
                        </Link>
                      </div>
                    </article>

                    <aside className="rounded-xl border border-zinc-200/90 bg-white p-5">
                      <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500">빠른 시작</p>
                      <ul className="mt-3 space-y-3 text-sm text-zinc-700">
                        <li className="flex items-start gap-2">
                          <ClipboardList className="mt-0.5 size-4 shrink-0 text-fuchsia-600" />
                          <span>
                            캠페인 목표, 장소, 인원만 입력하면
                            <br />
                            바로 견적을 볼 수 있습니다.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ClipboardList className="mt-0.5 size-4 shrink-0 text-fuchsia-600" />
                          <span>
                            상담 접수 시 실행 가능한 일정으로
                            <br />
                            제안을 정리해 드립니다.
                          </span>
                        </li>
                      </ul>
                      <Link href="/for-brands/process" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-4 w-full justify-start")}>
                        운영 프로세스 자세히 보기
                      </Link>
                    </aside>
                  </div>
                </>
              ) : null}

              {user.role === "INFLUENCER" ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <Link href="/influencer/my" className={cn(buttonVariants({ size: "lg" }))}>
                    인플루언서 마이페이지
                  </Link>
                  <Link href="/influencer/feed" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    캠페인 피드 보기
                  </Link>
                </div>
              ) : null}

              {user.role === "ADMIN" ? (
                <div className="mt-6">
                  <Link href="/admin" className={cn(buttonVariants({ size: "lg" }))}>
                    관리자 마이페이지
                  </Link>
                </div>
              ) : null}

              {!user.role ? (
                <div className="mt-6">
                  <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    브랜드 안내 페이지
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
