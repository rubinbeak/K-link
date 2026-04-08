"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function LoginForm({
  callbackUrl = "/my",
  intent = "login",
  googleEnabled = true,
  initialError = null,
}: {
  callbackUrl?: string;
  intent?: "login" | "signup";
  googleEnabled?: boolean;
  initialError?: string | null;
}) {
  const [error, setError] = useState<string | null>(initialError);
  const [googleLoading, setGoogleLoading] = useState(false);
  const ctaLabel = intent === "signup" ? "Google로 회원가입" : "Google로 로그인";

  return (
    <div className="space-y-4 text-center">
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
      {!googleEnabled ? (
        <p className="text-sm text-destructive">
          Google 로그인이 아직 활성화되지 않았습니다. `AUTH_GOOGLE_ID`와 `AUTH_GOOGLE_SECRET` 환경 변수를 먼저 설정해 주세요.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive text-center">{error}</p> : null}
    </div>
  );
}
