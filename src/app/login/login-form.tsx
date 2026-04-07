"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/auth/redirect",
    });

    setLoading(false);

    if (res?.error) {
      setError("이메일 또는 비밀번호를 확인해 주세요.");
      return;
    }

    window.location.href = "/auth/redirect";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={googleLoading}
        onClick={async () => {
          setGoogleLoading(true);
          await signIn("google", { callbackUrl: "/auth/redirect" });
          setGoogleLoading(false);
        }}
      >
        {googleLoading ? "구글 로그인으로 이동 중..." : "Google로 계속하기"}
      </Button>
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/70" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">또는</span>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>
      {error ? <p className="text-sm text-destructive">이메일 또는 비밀번호를 확인해 주세요.</p> : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
