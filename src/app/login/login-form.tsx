"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginForm({
  callbackUrl = "/auth/redirect",
  intent = "login",
  googleEnabled = true,
}: {
  callbackUrl?: string;
  intent?: "login" | "signup";
  googleEnabled?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const ctaLabel = intent === "signup" ? "Google로 회원가입" : "Google로 로그인";
  const helperText =
    intent === "signup"
      ? "처음 Google로 접속하면 브랜드 계정이 자동으로 생성됩니다."
      : "Google 계정으로 바로 로그인할 수 있습니다.";

  return (
    <div className="space-y-4">
      <Button
        type="button"
        className="w-full"
        disabled={googleLoading || !googleEnabled}
        onClick={async () => {
          if (!googleEnabled) return;
          setError(null);
          setGoogleLoading(true);
          await signIn("google", { callbackUrl, redirect: true });
          setGoogleLoading(false);
        }}
      >
        {googleLoading ? "Google 인증으로 이동 중..." : ctaLabel}
      </Button>
      {googleEnabled ? <p className="text-center text-xs text-muted-foreground">{helperText}</p> : null}
      {!googleEnabled ? (
        <p className="text-sm text-destructive">
          Google 로그인이 아직 활성화되지 않았습니다. `AUTH_GOOGLE_ID`와 `AUTH_GOOGLE_SECRET` 환경 변수를 먼저 설정해 주세요.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
