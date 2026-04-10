"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { BrandContactStep1 } from "@/lib/brand-profile";

const sectionCard = "rounded-xl border border-zinc-200/85 bg-white/85 p-4 sm:p-5";

export function BrandBasicInfoSection({
  initialProfile,
  className,
}: {
  initialProfile: BrandContactStep1;
  className?: string;
}) {
  const { update: updateSession } = useSession();
  const [profile, setProfile] = useState<BrandContactStep1>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/brand/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactBrandName: profile.contactBrandName,
          contactManagerProfile: profile.contactManagerProfile,
          contactPhone: profile.contactPhone,
        }),
      });
      const data = (await res.json()) as { profile?: BrandContactStep1; error?: unknown };
      if (!res.ok) {
        setMessage({ type: "err", text: "저장에 실패했습니다. 입력값을 확인해 주세요." });
        return;
      }
      if (data.profile) setProfile(data.profile);
      await updateSession();
      setMessage({ type: "ok", text: "저장되었습니다. 캠페인 세팅·상담 화면에도 동일하게 반영됩니다." });
    } catch {
      setMessage({ type: "err", text: "네트워크 오류로 저장하지 못했습니다." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={cn("rounded-2xl border border-zinc-200/80 bg-white/90 shadow-sm", className)}>
      <div className={sectionCard}>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900">담당자 정보를 알려주세요</h2>
        <p className="mb-4 text-sm text-zinc-600">
          아래 정보는 캠페인 세팅·상담 신청 시 자동으로 불러오며, 한 곳에서 수정하면 모두 동일하게 적용됩니다.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mypage-brandName">회사 / 브랜드명 *</Label>
            <Input
              id="mypage-brandName"
              value={profile.contactBrandName}
              onChange={(e) => setProfile((p) => ({ ...p, contactBrandName: e.target.value }))}
              placeholder="예: K-LINK Beauty"
              autoComplete="organization"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mypage-manager">직함, 담당자 이름 *</Label>
            <Input
              id="mypage-manager"
              value={profile.contactManagerProfile}
              onChange={(e) => setProfile((p) => ({ ...p, contactManagerProfile: e.target.value }))}
              placeholder="예: 마케팅 매니저 김민지"
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mypage-email">이메일 (로그인 계정)</Label>
            <Input
              id="mypage-email"
              type="email"
              readOnly
              tabIndex={-1}
              value={profile.contactEmail}
              className="cursor-not-allowed bg-muted/40"
              placeholder="you@brand.com"
              autoComplete="email"
            />
            <p className="text-xs text-muted-foreground">Google 로그인에 사용 중인 이메일입니다.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mypage-phone">연락처 *</Label>
            <Input
              id="mypage-phone"
              type="tel"
              value={profile.contactPhone}
              onChange={(e) => setProfile((p) => ({ ...p, contactPhone: e.target.value }))}
              placeholder="예: 010-1234-5678"
              autoComplete="tel"
            />
          </div>
        </div>
        <div className="mt-5 flex flex-col items-center gap-2">
          <Button type="button" onClick={() => void onSave()} disabled={saving}>
            {saving ? "저장 중..." : "기본 정보 저장"}
          </Button>
          {message ? (
            <p className={cn("max-w-md text-center text-sm", message.type === "ok" ? "text-emerald-700" : "text-destructive")}>
              {message.text}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
