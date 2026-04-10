import Link from "next/link";
import { LoginForm } from "@/app/login/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SignupPage({ searchParams }: { searchParams?: Promise<{ callbackUrl?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const rawCallbackUrl = resolvedSearchParams?.callbackUrl ?? "";
  const callbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/auth/redirect";
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -left-20 bottom-8 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[760px] flex-col justify-center px-5 py-12 sm:px-8">
        <div className="mb-8 flex flex-col items-center gap-2 text-center text-sm">
          <Link href="/" className="font-medium text-muted-foreground hover:text-foreground">
            ← 브랜드 메인으로
          </Link>
          <p className="text-xs text-muted-foreground">브랜드 전용 VISIT 콘텐츠 캠페인 운영 계정 생성</p>
        </div>
        <Card className="rounded-3xl border-border/70 bg-card/90 shadow-2xl shadow-pink-100/45 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-heading text-2xl tracking-tight">브랜드 회원가입</CardTitle>
            <CardDescription>
              별도 폼 입력 없이 Google 계정으로 바로 가입할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <LoginForm callbackUrl={callbackUrl} intent="signup" googleEnabled={googleEnabled} />
            <p className="text-center text-xs text-muted-foreground">
              이미 계정이 있다면 <Link href="/login" className="font-medium text-foreground hover:underline">로그인</Link>으로 이동해 주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
