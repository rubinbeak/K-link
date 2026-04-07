import Link from "next/link";
import { auth } from "@/auth";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

function roleLabel(role: string | undefined) {
  switch (role) {
    case "BRAND":
      return "브랜드";
    case "INFLUENCER":
      return "인플루언서";
    case "ADMIN":
      return "관리자";
    default:
      return "미설정";
  }
}

export default async function MyPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <main className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-4xl px-4 py-12">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">My Page</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-zinc-900">로그인 이후 시작 화면</h1>
        {!user ? (
          <>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              현재 로그인되어 있지 않습니다. 로그인 후 캠페인 세팅, 상담, 대시보드로 이동할 수 있습니다.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/login?callbackUrl=/my" className={cn(buttonVariants({ size: "lg" }))}>
                로그인/회원가입
              </Link>
              <Link href="/for-brands" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                브랜드 소개로 이동
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">{user.name ?? user.email ?? "사용자"}</span> 님, 로그인되었습니다.
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              계정 유형: <span className="font-medium text-zinc-900">{roleLabel(user.role)}</span>
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {user.role === "BRAND" ? (
                <>
                  <Link href="/brand" className={cn(buttonVariants({ size: "lg" }))}>
                    브랜드 대시보드
                  </Link>
                  <Link href="/campaign/setup" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    캠페인 세팅하기
                  </Link>
                  <Link href="/consulting" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    캠페인 상담하기
                  </Link>
                </>
              ) : null}

              {user.role === "INFLUENCER" ? (
                <>
                  <Link href="/influencer/my" className={cn(buttonVariants({ size: "lg" }))}>
                    인플루언서 마이페이지
                  </Link>
                  <Link href="/influencer/feed" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    캠페인 피드 보기
                  </Link>
                </>
              ) : null}

              {user.role === "ADMIN" ? (
                <Link href="/admin" className={cn(buttonVariants({ size: "lg" }))}>
                  관리자 대시보드
                </Link>
              ) : null}

              {!user.role ? (
                <Link href="/for-brands" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                  브랜드 안내 페이지
                </Link>
              ) : null}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
