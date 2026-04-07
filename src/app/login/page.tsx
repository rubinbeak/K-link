import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getLoginErrorMessage(error: string | undefined) {
  switch (error) {
    case "AccessDenied":
      return "로그인 중 DB 연결 또는 권한 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
      return "Google OAuth 처리 중 오류가 발생했습니다. OAuth 설정/콜백 URL을 확인해 주세요.";
    case "Callback":
      return "인증 콜백 처리 중 오류가 발생했습니다.";
    case "Configuration":
      return "인증 설정이 올바르지 않습니다. 서버 환경변수를 확인해 주세요.";
    default:
      return error ? `로그인 오류: ${error}` : null;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ callbackUrl?: string; intent?: string; error?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/auth/redirect");
  }

  const resolvedSearchParams = await searchParams;
  const rawCallbackUrl = resolvedSearchParams?.callbackUrl ?? "";
  const callbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/auth/redirect";
  const intent = resolvedSearchParams?.intent === "signup" ? "signup" : "login";
  const errorMessage = getLoginErrorMessage(resolvedSearchParams?.error);
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

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
            <CardTitle className="font-heading text-2xl tracking-tight">{intent === "signup" ? "브랜드 회원가입" : "브랜드 로그인"}</CardTitle>
            <CardDescription>
              Google 계정으로 간편하게 {intent === "signup" ? "가입" : "로그인"}하고 VISIT 콘텐츠 캠페인 운영을 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <LoginForm callbackUrl={callbackUrl} intent={intent} googleEnabled={googleEnabled} initialError={errorMessage} />
            <p className="text-center text-xs text-muted-foreground">
              {intent === "signup" ? (
                <>
                  이미 계정이 있다면{" "}
                  <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-foreground hover:underline">
                    로그인
                  </Link>
                </>
              ) : (
                <>
                  계정이 없다면{" "}
                  <Link
                    href={`/login?intent=signup&callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
