"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { REGION_VALUES, regionLabel } from "@/lib/visit-campaign";

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<"KAKAO" | "MEETING">("KAKAO");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      channel,
      name: String(formData.get("name") ?? ""),
      company: String(formData.get("company") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      targetRegion: String(formData.get("targetRegion") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const res = await fetch("/api/consulting-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (!res.ok) {
      setError("문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setSuccess("상담 요청이 접수되었습니다. 빠르게 연락드릴게요.");
    form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/70 bg-card p-5">
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant={channel === "KAKAO" ? "default" : "outline"}
          onClick={() => setChannel("KAKAO")}
        >
          카카오톡 비즈 채널
        </Button>
        <Button
          type="button"
          variant={channel === "MEETING" ? "default" : "outline"}
          onClick={() => setChannel("MEETING")}
        >
          화상미팅 예약
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">이름</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">회사명</Label>
          <Input id="company" name="company" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">연락처</Label>
          <Input id="phone" name="phone" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="targetRegion">희망 국가/권역</Label>
        <select
          id="targetRegion"
          name="targetRegion"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          defaultValue=""
        >
          <option value="">선택</option>
          {REGION_VALUES.map((region) => (
            <option key={region} value={region}>
              {regionLabel[region]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">문의 내용</Label>
        <Textarea id="message" name="message" rows={4} />
      </div>

      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "접수 중..." : "상담 요청 보내기"}
      </Button>
    </form>
  );
}
