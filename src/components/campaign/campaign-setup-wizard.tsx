"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BENEFIT_VALUES,
  benefitLabel,
  estimatePricing,
  FOLLOWER_TIER_VALUES,
  followerTierLabel,
  GENDER_VALUES,
  genderLabel,
  PLACE_TYPE_VALUES,
  placeTypeLabel,
  PLATFORM_VALUES,
  platformLabel,
  REGION_VALUES,
  regionLabel,
  VISIT_GOAL_VALUES,
  visitGoalLabel,
} from "@/lib/visit-campaign";

export type CampaignDraftData = {
  step1: {
    contactBrandName: string;
    contactManagerProfile: string;
    contactEmail: string;
    contactPhone: string;
    campaignName: string;
    placeType: string;
    visitGoals: string[];
  };
  step2: {
    visitRegion: string;
    address: string;
    venueDescription: string;
    eventStartDate: string;
    eventEndDate: string;
    operationStartTime: string;
    operationEndTime: string;
    hasBenefits: boolean;
    benefitTypes: string[];
    productDescription: string;
    productValueKrw: number | "";
  };
  step3: {
    targetRegions: string[];
    genderTarget: string;
    followerTier: "LTE_5K" | "BETWEEN_5K_30K" | "GTE_30K";
    platforms: string[];
    headcount: number;
  };
};

const defaultData: CampaignDraftData = {
  step1: {
    contactBrandName: "",
    contactManagerProfile: "",
    contactEmail: "",
    contactPhone: "",
    campaignName: "",
    placeType: "",
    visitGoals: [],
  },
  step2: {
    visitRegion: "",
    address: "",
    venueDescription: "",
    eventStartDate: "",
    eventEndDate: "",
    operationStartTime: "",
    operationEndTime: "",
    hasBenefits: false,
    benefitTypes: [],
    productDescription: "",
    productValueKrw: "",
  },
  step3: {
    targetRegions: [],
    genderTarget: "ANY",
    followerTier: "LTE_5K",
    platforms: [],
    headcount: 1,
  },
};

const fullProcessSteps = [
  "캠페인 세팅 및 결제",
  "가이드라인 확정",
  "인플루언서 리스트 전달",
  "현장 방문 및 촬영",
  "업로드 관리",
  "결과 보고",
];

export function CampaignSetupWizard({
  initialDraftId,
  initialData,
}: {
  initialDraftId?: string;
  initialData?: Partial<CampaignDraftData>;
}) {
  const router = useRouter();
  const [draftId, setDraftId] = useState(initialDraftId ?? "");
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [finalizing, setFinalizing] = useState(false);
  const [data, setData] = useState<CampaignDraftData>({
    ...defaultData,
    ...initialData,
    step1: { ...defaultData.step1, ...(initialData?.step1 ?? {}) },
    step2: { ...defaultData.step2, ...(initialData?.step2 ?? {}) },
    step3: { ...defaultData.step3, ...(initialData?.step3 ?? {}) },
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pricing = useMemo(
    () => estimatePricing({ headcount: data.step3.headcount, followerTier: data.step3.followerTier }),
    [data.step3.headcount, data.step3.followerTier],
  );
  const activeProcessIndex = step;

  async function saveDraft(mode: "manual" | "auto") {
    setSaving(true);
    setError("");
    const payload = {
      name: data.step1.campaignName || "방문형 콘텐츠 캠페인",
      currentStep: step,
      data,
    };

    try {
      let response: Response;
      if (!draftId) {
        response = await fetch("/api/campaign-drafts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`/api/campaign-drafts/${draftId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "save failed");
      if (!draftId && json.draftId) setDraftId(json.draftId);
      setSavedAt(new Date().toLocaleTimeString());
      if (!initialDraftId && json.draftId) {
        router.replace(`/campaign/setup/${json.draftId}`);
      }
    } catch {
      if (mode === "manual") setError("임시 저장 실패. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void saveDraft("auto");
    }, 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, step, draftId]);

  useEffect(() => {
    const id = setInterval(() => void saveDraft("auto"), 300000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, step, draftId]);

  async function finalizeCampaign() {
    if (!draftId) {
      await saveDraft("manual");
      return;
    }
    setFinalizing(true);
    setError("");
    const res = await fetch(`/api/campaign-drafts/${draftId}/finalize`, { method: "POST" });
    const json = await res.json();
    setFinalizing(false);
    if (!res.ok) {
      setError(json.error ?? "캠페인 생성 실패");
      return;
    }
    if (json?.paymentId) {
      router.push(`/brand/payments/${json.paymentId}/invoice`);
      return;
    }
    router.push("/brand");
  }

  const statusText = saving ? "자동 저장 중..." : savedAt ? `마지막 저장 ${savedAt}` : "아직 저장되지 않음";

  function toggle(list: string[], value: string) {
    return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <Card className="brand-panel">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">캠페인 세팅하기</CardTitle>
            <CardDescription>
              임시 저장 + 5분 자동 저장 + 입력 변경 시 자동 저장(10초)
              <br />
              프로세스 1단계인 캠페인 세팅 및 결제를 완료하는 화면입니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="brand-panel sticky top-20 z-10">
          <CardHeader>
            <CardTitle>진행 단계</CardTitle>
            <CardDescription>총 6단계 중 현재 위치를 표시합니다. 이 화면은 1~3단계를 처리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-6 gap-2">
              {fullProcessSteps.map((label, idx) => (
                <div
                  key={label}
                  className={`h-2 rounded-full ${idx + 1 <= activeProcessIndex ? "bg-primary" : "bg-muted"}`}
                  aria-hidden
                />
              ))}
            </div>
            <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              {fullProcessSteps.map((label, idx) => (
                <p key={label} className={idx + 1 === activeProcessIndex ? "font-semibold text-foreground" : ""}>
                  {idx + 1}. {label}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="brand-panel">
          <CardHeader>
            <CardTitle>단계 {step}</CardTitle>
            <CardDescription>
              {step === 1
                ? "캠페인 세팅 및 결제 - 기본 정보"
                : step === 2
                  ? "가이드라인 확정 - 장소 / 일정 / 혜택"
                  : "인플루언서 리스트 전달 - 타겟 / 플랫폼 / 인원"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 ? (
              <>
                <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
                  <div className="mb-4">
                    <p className="text-[11px] font-semibold tracking-widest text-primary">1. 기본 정보</p>
                    <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-900">담당자 정보를 알려주세요</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contactBrandName">회사 / 브랜드명 *</Label>
                      <Input
                        id="contactBrandName"
                        required
                        value={data.step1.contactBrandName}
                        onChange={(e) =>
                          setData((p) => ({ ...p, step1: { ...p.step1, contactBrandName: e.target.value } }))
                        }
                        placeholder="예: K-LINK Beauty"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactManagerProfile">직함, 담당자 이름 *</Label>
                      <Input
                        id="contactManagerProfile"
                        required
                        value={data.step1.contactManagerProfile}
                        onChange={(e) =>
                          setData((p) => ({ ...p, step1: { ...p.step1, contactManagerProfile: e.target.value } }))
                        }
                        placeholder="예: 마케팅 매니저 김민지"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">이메일 *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        required
                        value={data.step1.contactEmail}
                        onChange={(e) => setData((p) => ({ ...p, step1: { ...p.step1, contactEmail: e.target.value } }))}
                        placeholder="you@brand.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">연락처 *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        required
                        value={data.step1.contactPhone}
                        onChange={(e) => setData((p) => ({ ...p, step1: { ...p.step1, contactPhone: e.target.value } }))}
                        placeholder="예: 010-1234-5678"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaignName">캠페인 이름</Label>
                  <Input
                    id="campaignName"
                    value={data.step1.campaignName}
                    onChange={(e) => setData((p) => ({ ...p, step1: { ...p.step1, campaignName: e.target.value } }))}
                    placeholder="예: 과일나라 팝업스토어 방문 콘텐츠"
                  />
                </div>
                <div className="space-y-2">
                  <Label>방문 장소 유형</Label>
                  <select
                    value={data.step1.placeType}
                    onChange={(e) => setData((p) => ({ ...p, step1: { ...p.step1, placeType: e.target.value } }))}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    <option value="">선택</option>
                    {PLACE_TYPE_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {placeTypeLabel[v]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>방문 목적 (복수)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {VISIT_GOAL_VALUES.map((goal) => (
                      <label key={goal} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.step1.visitGoals.includes(goal)}
                          onChange={() =>
                            setData((p) => ({
                              ...p,
                              step1: { ...p.step1, visitGoals: toggle(p.step1.visitGoals, goal) },
                            }))
                          }
                        />
                        {visitGoalLabel[goal]}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="space-y-2">
                  <Label>방문 지역</Label>
                  <select
                    value={data.step2.visitRegion}
                    onChange={(e) => setData((p) => ({ ...p, step2: { ...p.step2, visitRegion: e.target.value } }))}
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    <option value="">선택</option>
                    {REGION_VALUES.map((v) => (
                      <option key={v} value={v}>
                        {regionLabel[v]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">정확한 주소</Label>
                  <Input
                    id="address"
                    value={data.step2.address}
                    onChange={(e) => setData((p) => ({ ...p, step2: { ...p.step2, address: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueDescription">장소 설명</Label>
                  <Textarea
                    id="venueDescription"
                    rows={3}
                    value={data.step2.venueDescription}
                    onChange={(e) =>
                      setData((p) => ({ ...p, step2: { ...p.step2, venueDescription: e.target.value } }))
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>행사 시작일</Label>
                    <Input
                      type="date"
                      value={data.step2.eventStartDate}
                      onChange={(e) => setData((p) => ({ ...p, step2: { ...p.step2, eventStartDate: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>행사 종료일</Label>
                    <Input
                      type="date"
                      value={data.step2.eventEndDate}
                      onChange={(e) => setData((p) => ({ ...p, step2: { ...p.step2, eventEndDate: e.target.value } }))}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>운영 시작 시간</Label>
                    <Input
                      type="time"
                      value={data.step2.operationStartTime}
                      onChange={(e) =>
                        setData((p) => ({ ...p, step2: { ...p.step2, operationStartTime: e.target.value } }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>운영 종료 시간</Label>
                    <Input
                      type="time"
                      value={data.step2.operationEndTime}
                      onChange={(e) =>
                        setData((p) => ({ ...p, step2: { ...p.step2, operationEndTime: e.target.value } }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>제공 혜택</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={data.step2.hasBenefits ? "default" : "outline"}
                      onClick={() => setData((p) => ({ ...p, step2: { ...p.step2, hasBenefits: true } }))}
                    >
                      있음
                    </Button>
                    <Button
                      type="button"
                      variant={!data.step2.hasBenefits ? "default" : "outline"}
                      onClick={() =>
                        setData((p) => ({ ...p, step2: { ...p.step2, hasBenefits: false, benefitTypes: [] } }))
                      }
                    >
                      없음
                    </Button>
                  </div>
                </div>
                {data.step2.hasBenefits ? (
                  <>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {BENEFIT_VALUES.map((benefit) => (
                        <label key={benefit} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={data.step2.benefitTypes.includes(benefit)}
                            onChange={() =>
                              setData((p) => ({
                                ...p,
                                step2: { ...p.step2, benefitTypes: toggle(p.step2.benefitTypes, benefit) },
                              }))
                            }
                          />
                          {benefitLabel[benefit]}
                        </label>
                      ))}
                    </div>
                    {data.step2.benefitTypes.includes("PRODUCT") ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          placeholder="제공 제품 내용"
                          value={data.step2.productDescription}
                          onChange={(e) =>
                            setData((p) => ({ ...p, step2: { ...p.step2, productDescription: e.target.value } }))
                          }
                        />
                        <Input
                          type="number"
                          placeholder="예상 가치(원)"
                          value={data.step2.productValueKrw}
                          onChange={(e) =>
                            setData((p) => ({
                              ...p,
                              step2: {
                                ...p.step2,
                                productValueKrw: e.target.value ? Number(e.target.value) : "",
                              },
                            }))
                          }
                        />
                      </div>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="space-y-2">
                  <Label>타겟 국가(복수)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {REGION_VALUES.map((region) => (
                      <label key={region} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.step3.targetRegions.includes(region)}
                          onChange={() =>
                            setData((p) => ({
                              ...p,
                              step3: { ...p.step3, targetRegions: toggle(p.step3.targetRegions, region) },
                            }))
                          }
                        />
                        {regionLabel[region]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>타겟 성별</Label>
                  <div className="flex flex-wrap gap-2">
                    {GENDER_VALUES.map((gender) => (
                      <Button
                        key={gender}
                        type="button"
                        variant={data.step3.genderTarget === gender ? "default" : "outline"}
                        onClick={() => setData((p) => ({ ...p, step3: { ...p.step3, genderTarget: gender } }))}
                      >
                        {genderLabel[gender]}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>팔로워 구간</Label>
                  <select
                    value={data.step3.followerTier}
                    onChange={(e) =>
                      setData((p) => ({
                        ...p,
                        step3: {
                          ...p.step3,
                          followerTier: e.target.value as CampaignDraftData["step3"]["followerTier"],
                        },
                      }))
                    }
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    {FOLLOWER_TIER_VALUES.map((tier) => (
                      <option key={tier} value={tier}>
                        {followerTierLabel[tier]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>플랫폼(복수)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PLATFORM_VALUES.map((platform) => (
                      <label key={platform} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={data.step3.platforms.includes(platform)}
                          onChange={() =>
                            setData((p) => ({
                              ...p,
                              step3: { ...p.step3, platforms: toggle(p.step3.platforms, platform) },
                            }))
                          }
                        />
                        {platformLabel[platform]}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="headcount">인원수</Label>
                  <Input
                    id="headcount"
                    type="number"
                    min={1}
                    value={data.step3.headcount}
                    onChange={(e) =>
                      setData((p) => ({ ...p, step3: { ...p.step3, headcount: Number(e.target.value || 1) } }))
                    }
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
            이전
          </Button>
          <Button type="button" variant="outline" onClick={() => void saveDraft("manual")} disabled={saving}>
            임시 저장
          </Button>
          <Button type="button" disabled={step === 3} onClick={() => setStep((s) => Math.min(3, s + 1))}>
            다음
          </Button>
          {step === 3 ? (
            <Button type="button" onClick={finalizeCampaign} disabled={finalizing}>
              {finalizing ? "입금 안내 생성 중..." : "캠페인 세팅 및 결제 완료하기"}
            </Button>
          ) : null}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <Card className="brand-panel">
          <CardHeader>
            <CardTitle>프로세스 매핑</CardTitle>
            <CardDescription>노출 용어를 캠페인 프로세스 페이지와 동일하게 맞췄습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1) 캠페인 세팅 및 결제</p>
            <p>2) 가이드라인 확정</p>
            <p>3) 인플루언서 리스트 전달</p>
            <p className="text-muted-foreground">4) 현장 방문 및 촬영</p>
            <p className="text-muted-foreground">5) 업로드 관리</p>
            <p className="text-muted-foreground">6) 결과 보고</p>
          </CardContent>
        </Card>

        <Card className="brand-panel">
          <CardHeader>
            <CardTitle>실시간 요약</CardTitle>
            <CardDescription>{statusText}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              캠페인명: <span className="font-medium">{data.step1.campaignName || "미입력"}</span>
            </p>
            <p>
              인원수: <span className="font-medium">{pricing.headcount}명</span>
            </p>
            <p>
              기본가: <span className="font-medium">{pricing.basePrice.toLocaleString()}원</span>
            </p>
            <p>
              팔로워 추가금: <span className="font-medium">{pricing.followerSurcharge.toLocaleString()}원</span>
            </p>
            <p className="pt-2 text-base font-semibold">
              예상 총액: <span className="text-primary">{pricing.totalPrice.toLocaleString()}원</span>
            </p>
            <p className="text-xs text-muted-foreground">방문 후 7일 이내 업로드 기준으로 운영됩니다.</p>
            <p className="text-xs text-muted-foreground">결제는 무통장입금으로 진행되며 PG 연동은 제공하지 않습니다.</p>
          </CardContent>
        </Card>
        {error ? (
          <Card className="border-destructive/40">
            <CardContent className="pt-6 text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : null}
      </aside>
    </div>
  );
}
