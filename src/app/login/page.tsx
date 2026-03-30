import Link from "next/link";
import { LoginForm } from "./login-form";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-300/25 blur-3xl" />
        <div className="absolute -left-20 bottom-8 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-2 text-center text-sm">
          <Link href="/" className="font-medium text-muted-foreground hover:text-foreground">
            ← 홈으로
          </Link>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <Link href="/for-brands" className="hover:text-foreground">
              브랜드 안내
            </Link>
            <span className="text-border">·</span>
            <Link href="/creators" className="hover:text-foreground">
              크리에이터 안내
            </Link>
          </div>
        </div>
        <Card className="rounded-3xl border-border/70 bg-card/85 shadow-2xl shadow-pink-100/45 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-heading text-2xl tracking-tight">로그인</CardTitle>
            <CardDescription>
              구글 로그인 또는 데모 계정으로 K-LINK 서비스를 바로 확인해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MiniVisualMotif title="빠른 시작 가이드" description="로그인 후 역할에 맞는 대시보드로 자동 이동됩니다." />
            <LoginForm />
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
