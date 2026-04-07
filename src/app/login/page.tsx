import Link from "next/link";
import { LoginForm } from "./login-form";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ email?: string; callbackUrl?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const defaultEmail = resolvedSearchParams?.email ?? "";
  const rawCallbackUrl = resolvedSearchParams?.callbackUrl ?? "";
  const callbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/auth/redirect";

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -left-20 bottom-8 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-2 text-center text-sm">
          <Link href="/for-brands" className="font-medium text-muted-foreground hover:text-foreground">
            ← 브랜드 안내로
          </Link>
          <p className="text-xs text-muted-foreground">공개 랜딩은 브랜드 전용 페이지만 운영 중입니다.</p>
        </div>
        <Card className="rounded-3xl border-border/70 bg-card/85 shadow-2xl shadow-pink-100/45 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-heading text-2xl tracking-tight">로그인</CardTitle>
            <CardDescription>
              브랜드 계정으로 로그인하거나 회원가입 후 VISIT 콘텐츠 캠페인 운영을 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MiniVisualMotif title="빠른 시작 가이드" description="로그인 후 역할에 맞는 대시보드로 자동 이동됩니다." />
            <LoginForm defaultEmail={defaultEmail} callbackUrl={callbackUrl} />
            <p className="text-center text-xs text-muted-foreground">
              브랜드 계정이 없다면 <Link href="/signup" className="font-medium text-foreground hover:underline">회원가입</Link>
            </p>
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/50 p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">데모 계정 (비밀번호: demo123)</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>brand@k-link.demo — 브랜드 포털</li>
                <li>influencer@k-link.demo — 인플루언서 포털</li>
                <li>admin@k-link.demo — 관리자</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
