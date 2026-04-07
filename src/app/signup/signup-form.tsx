"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUNTRY_CODE_OPTIONS } from "@/lib/phone";

type FieldErrors = Partial<
  Record<"brandName" | "managerName" | "countryCode" | "contactPhone" | "email" | "password" | "passwordConfirm", string[]>
>;

export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const payload = {
      brandName: (form.elements.namedItem("brandName") as HTMLInputElement).value,
      managerName: (form.elements.namedItem("managerName") as HTMLInputElement).value,
      countryCode: (form.elements.namedItem("countryCode") as HTMLSelectElement).value,
      contactPhone: (form.elements.namedItem("contactPhone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      passwordConfirm: (form.elements.namedItem("passwordConfirm") as HTMLInputElement).value,
    };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => null);
    setLoading(false);

    if (!res.ok) {
      if (json?.fields) setFieldErrors(json.fields as FieldErrors);
      setError(json?.error ?? "회원가입 중 오류가 발생했습니다.");
      return;
    }

    router.push(`/login?email=${encodeURIComponent(payload.email)}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="brandName">브랜드 이름</Label>
        <Input id="brandName" name="brandName" required placeholder="예: K-LINK Beauty" />
        {fieldErrors.brandName?.[0] ? <p className="text-xs text-destructive">{fieldErrors.brandName[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="managerName">담당자 이름</Label>
        <Input id="managerName" name="managerName" required placeholder="예: 홍길동" />
        {fieldErrors.managerName?.[0] ? <p className="text-xs text-destructive">{fieldErrors.managerName[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="countryCode">국가 코드</Label>
        <select
          id="countryCode"
          name="countryCode"
          className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          defaultValue="+82"
        >
          {COUNTRY_CODE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.countryCode?.[0] ? <p className="text-xs text-destructive">{fieldErrors.countryCode[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">회사 혹은 담당자 전화번호</Label>
        <Input id="contactPhone" name="contactPhone" type="tel" required placeholder="예: 010-1234-5678" />
        {fieldErrors.contactPhone?.[0] ? <p className="text-xs text-destructive">{fieldErrors.contactPhone[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">컨택 이메일</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@brand.com" />
        <p className="text-xs text-muted-foreground">이 이메일이 로그인 아이디로 사용됩니다.</p>
        {fieldErrors.email?.[0] ? <p className="text-xs text-destructive">{fieldErrors.email[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required placeholder="8자 이상" />
        {fieldErrors.password?.[0] ? <p className="text-xs text-destructive">{fieldErrors.password[0]}</p> : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          placeholder="비밀번호를 다시 입력해 주세요."
        />
        {fieldErrors.passwordConfirm?.[0] ? (
          <p className="text-xs text-destructive">{fieldErrors.passwordConfirm[0]}</p>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "가입 처리 중..." : "브랜드 회원가입"}
      </Button>
    </form>
  );
}
