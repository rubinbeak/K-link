"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarRange, ClipboardList, FileText, MapPin, Sparkles, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  estimatePricing,
  FOLLOWER_TIER_VALUES,
  followerTierLabel,
  REGION_VALUES,
  regionLabel,
} from "@/lib/visit-campaign";
import { cn } from "@/lib/utils";

const money = new Intl.NumberFormat("ko-KR");

export function CampaignSetupPreview() {
  const [campaignTitle, setCampaignTitle] = useState("봄 시즌 팝업 방문 캠페인");
  const [visitRegion, setVisitRegion] = useState<(typeof REGION_VALUES)[number]>("KR");
  const [headcount, setHeadcount] = useState(4);
  const [followerTier, setFollowerTier] = useState<(typeof FOLLOWER_TIER_VALUES)[number]>("LTE_5K");
  const [visitWindow, setVisitWindow] = useState("2026-04-20 ~ 2026-04-27 (현장 운영 11:00–19:00)");
  const [guidelines, setGuidelines] = useState(
    "브랜드 로고 노출, 매장 시그니처 메뉴/제품 클로즈업, 자연스러운 일상 톤. 과장 표현·의료 효능 표현 금지.",
  );
  const [exposureInfo, setExposureInfo] = useState(
    "필수 해시태그 #브랜드명 #팝업명, 매장 위치 스티커, 공식 계정 태그 @brand_official",
  );
  const [precautions, setPrecautions] = useState(
    "촬영 구역은 1층 팝업존만. 직원 얼굴 노출 시 사전 동의. 경쟁사 언급 금지.",
  );
  const [poolCriteria, setPoolCriteria] = useState(
    "한국 거주, 뷰티·라이프스타일 톤, 팔로워 구간·성별은 아래에서 조정. 방문 가능 요일: 화–일.",
  );

  const pricing = useMemo(
    () => estimatePricing({ headcount: Math.min(30, Math.max(1, headcount)), followerTier }),
    [headcount, followerTier],
  );

  const regionName = regionLabel[visitRegion];

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-3xl px-4 py-10 pb-24 lg:max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/for-brands" className="text-sm text-muted-foreground hover:text-foreground">
            ← 브랜드 안내
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              로그인
            </Link>
            <Link
              href="/signup"
              className={cn(buttonVariants({ size: "sm" }), "bg-[#ff2f9b] text-white hover:bg-[#e61c8d]")}
            >
              브랜드 회원가입
            </Link>
          </div>
        </div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          캠페인 세팅 미리보기 · 임시 안내
        </div>
        <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          캠페인 세팅이란?
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base">
          결제가 확정된 뒤 브랜드가 운영팀에 <strong className="font-semibold text-zinc-800">“이렇게 진행할게요”</strong>라고
          한 번에 전달하는 단계입니다. 방문 일정, 촬영·업로드 가이드, 노출 정보, 유의사항, 인플루언서 풀 조건 등을 정리해 두면 섭외·현장·보고까지 같은
          기준으로 맞춰집니다.
        </p>

        <Card className="mt-10 border-fuchsia-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-900">
              <ClipboardList className="size-5 text-primary" />
              브랜드가 전달하는 한 줄 요약 (예시)
            </CardTitle>
            <CardDescription>
              아래 숫자와 권역을 바꿔 보면, 실제 세팅 화면에서 비슷한 문장으로 정리됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-4 text-sm leading-relaxed text-zinc-800 sm:p-5 sm:text-base">
              <p className="text-pretty">
                「<span className="font-semibold text-zinc-900">{campaignTitle || "캠페인명"}</span>」은{" "}
                <span className="font-semibold text-primary tabular-nums">{money.format(pricing.totalPrice)}원</span>으로 인플루언서{" "}
                <span className="font-semibold text-zinc-900 tabular-nums">{pricing.headcount}명</span>을 계약하고,{" "}
                <span className="font-semibold text-zinc-900">{regionName}</span> 현장 방문·촬영 후 지정 채널에 업로드하는 방문형 캠페인으로
                진행합니다. (인당 단가 약 {money.format(pricing.unitPrice)}원 ·{" "}
                {followerTierLabel[followerTier]} 구간 기준)
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="preview-headcount">인플루언서 인원</Label>
                <Input
                  id="preview-headcount"
                  type="number"
                  min={1}
                  max={30}
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value) || 1)}
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label>팔로워 구간</Label>
                <Select value={followerTier} onValueChange={(v) => setFollowerTier(v as (typeof FOLLOWER_TIER_VALUES)[number])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FOLLOWER_TIER_VALUES.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {followerTierLabel[tier]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>방문 권역</Label>
                <Select value={visitRegion} onValueChange={(v) => setVisitRegion(v as (typeof REGION_VALUES)[number])}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_VALUES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {regionLabel[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preview-title">캠페인 제목 (내부용)</Label>
              <Input id="preview-title" value={campaignTitle} onChange={(e) => setCampaignTitle(e.target.value)} placeholder="예: 봄 팝업 방문 릴스" />
            </div>
          </CardContent>
        </Card>

        <div className="mt-10 space-y-6">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-zinc-900">세팅에서 다루는 항목 (체크리스트)</h2>
          <p className="text-sm leading-relaxed text-zinc-600">
            실제 서비스에서는 아래 내용을 단계별 폼에 입력·저장합니다. 여기서는 브라우저에만 남고 서버에 저장되지 않습니다.
          </p>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarRange className="size-4 text-primary" />
                방문·운영 일정
              </CardTitle>
              <CardDescription>현장 가능 일시, 운영 시간, 멀티데이 여부 등</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={visitWindow}
                onChange={(e) => setVisitWindow(e.target.value)}
                rows={3}
                className="resize-y text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-4 text-primary" />
                캠페인 가이드라인
              </CardTitle>
              <CardDescription>톤앤매너, 필수 샷, 금지 표현, 브랜드 자산 사용 범위</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={guidelines} onChange={(e) => setGuidelines(e.target.value)} rows={4} className="resize-y text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="size-4 text-primary" />
                노출·언급해야 할 정보
              </CardTitle>
              <CardDescription>해시태그, 위치 태그, 링크, 프로모션 문구, UTM 등</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={exposureInfo} onChange={(e) => setExposureInfo(e.target.value)} rows={3} className="resize-y text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">유의사항 · 촬영 제약</CardTitle>
              <CardDescription>촬영 가능 구역, 동의, 경쟁사·민감 카테고리 규칙</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={precautions} onChange={(e) => setPrecautions(e.target.value)} rows={3} className="resize-y text-sm" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="size-4 text-primary" />
                인플루언서 풀 조건
              </CardTitle>
              <CardDescription>거주 국가·언어, 카테고리, 팔로워 구간, 성별, 방문 가능 요일</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={poolCriteria} onChange={(e) => setPoolCriteria(e.target.value)} rows={4} className="resize-y text-sm" />
            </CardContent>
          </Card>
        </div>

        <div
          className={cn(
            "mt-10 rounded-xl border border-amber-200/90 bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-950",
          )}
        >
          <strong className="font-semibold">임시 페이지 안내.</strong> 입력 내용은 저장되지 않으며, 견적·결제·초안 자동 저장은{" "}
          <Link href="/signup" className="font-medium text-primary underline-offset-2 hover:underline">
            브랜드 회원가입
          </Link>
          후 캠페인 세팅(전용 폼)에서 이어갈 수 있습니다.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: "lg" }), "bg-[#ff2f9b] text-white hover:bg-[#e61c8d]")}
          >
            회원가입하고 실제 세팅 시작
          </Link>
          <Link href="/for-brands" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            브랜드 안내로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
