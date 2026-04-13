"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Clock3, Plus, Save, ShieldCheck, Sparkles, Trash2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { benefitLabel, BENEFIT_VALUES, platformLabel, PLATFORM_VALUES, regionLabel, REGION_VALUES } from "@/lib/visit-campaign";
import { useCampaignFormAutosave } from "@/components/campaign/use-campaign-form-autosave";
import {
  effectiveFunnelPlaces,
  isFunnelDraftData,
  isValidFunnelPlaceRow,
  type FunnelDraftPayload,
} from "@/lib/funnel-campaign-finalize";
import { mergeBrandProfileIntoStep1, type BrandContactStep1 } from "@/lib/brand-profile";
import { openFinalizePendingTab } from "@/lib/campaign-post-submit";

const PLACE_OPTIONS = [
  { value: "BEAUTY_STORE", label: "뷰티 매장" },
  { value: "SHOPPING_MALL", label: "쇼핑몰" },
  { value: "POPUP_STORE", label: "팝업스토어" },
  { value: "EVENT_BOOTH", label: "축제/행사 부스" },
  { value: "CLINIC", label: "병원/클리닉" },
  { value: "FASHION_SHOWROOM", label: "패션 매장/쇼룸" },
  { value: "EXPO", label: "전시/박람회" },
  { value: "RESTAURANT_FNB", label: "레스토랑/F&B" },
  { value: "OTHER", label: "기타(직접입력)" },
] as const;

const DEFAULT_PURPOSE_OPTIONS = [
  "팝업스토어 소개",
  "팝업스토어 및 행사 부스 소개",
  "매장 소개 및 홍보",
  "제품 체험 및 홍보",
  "브랜드 체험",
  "이벤트 참여",
  "인터뷰 진행",
  "신규 오픈 홍보",
  "할인 / 이벤트 홍보",
  "기타",
] as const;

const CLINIC_PURPOSE_OPTIONS = [
  "외국 신환 유치",
  "병원 오픈 소개",
  "시설 및 시술 홍보",
  "병원 인터뷰",
] as const;

const UNIT_PRICE_UNDER_5K = 250000;
const UNIT_PRICE_OVER_5K = 500000;

type CampaignSetupFormData = {
  step1: {
    contactBrandName: string;
    contactManagerProfile: string;
    contactEmail: string;
    contactPhone: string;
    campaignName: string;
    placeType: string;
    placeTypeCustom: string;
    visitPurposes: string[];
  };
  step2: {
    draftPlace: {
      visitCountry: string;
      address: string;
      placeDescription: string;
      eventStartDate: string;
      eventEndDate: string;
      operationStartTime: string;
      operationEndTime: string;
    };
    places: Array<{
      visitCountry: string;
      address: string;
      placeDescription: string;
      eventStartDate: string;
      eventEndDate: string;
      operationStartTime: string;
      operationEndTime: string;
    }>;
    hasBenefits: "YES" | "NO";
    benefitTypes: string[];
    benefitOtherText: string;
    productDetails: string;
    productEstimatedValue: string;
  };
  step3: {
    targetCountries: string[];
    followerCountUnder5k: number;
    followerCountOver5k: number;
    extraRequests: string;
    platforms: string[];
  };
};

const defaultData: CampaignSetupFormData = {
  step1: {
    contactBrandName: "",
    contactManagerProfile: "",
    contactEmail: "",
    contactPhone: "",
    campaignName: "",
    placeType: "",
    placeTypeCustom: "",
    visitPurposes: [],
  },
  step2: {
    draftPlace: {
      visitCountry: "",
      address: "",
      placeDescription: "",
      eventStartDate: "",
      eventEndDate: "",
      operationStartTime: "",
      operationEndTime: "",
    },
    places: [],
    hasBenefits: "NO",
    benefitTypes: [],
    benefitOtherText: "",
    productDetails: "",
    productEstimatedValue: "",
  },
  step3: {
    targetCountries: [],
    followerCountUnder5k: 1,
    followerCountOver5k: 0,
    extraRequests: "",
    platforms: [],
  },
};

const stepTitles = ["기본 정보", "장소 / 일정", "인플루언서 / 플랫폼"] as const;
const stepDescriptions = [
  "캠페인의 기본 성격을 정합니다.",
  "현장 운영에 필요한 장소/일정/혜택 정보를 정리합니다.",
  "인플루언서 조건과 업로드 채널을 확정합니다.",
] as const;
const cardBase = "rounded-2xl border border-zinc-200/80 bg-white/90 shadow-[0_14px_44px_-28px_rgba(236,72,153,0.45)]";
const sectionCard = "rounded-xl border border-zinc-200/85 bg-white/85 p-4 sm:p-5";

function toggleArrayItem(arr: string[], value: string) {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

/** 숫자만 허용 · 포커스 중에는 문자열 draft로 두어 키보드 입력이 끊기지 않게 함 */
const FOLLOWER_HEADCOUNT_INPUT_MAX = 9999;

function FollowerHeadcountInput({
  id,
  "aria-label": ariaLabel,
  value,
  onCommit,
  className,
}: {
  id: string;
  "aria-label": string;
  value: number;
  onCommit: (n: number) => void;
  className?: string;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const safe = Math.max(0, Math.min(FOLLOWER_HEADCOUNT_INPUT_MAX, Math.floor(Number.isFinite(value) ? value : 0)));
  const display = draft !== null ? draft : String(safe);

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      aria-label={ariaLabel}
      className={className}
      value={display}
      onFocus={() => setDraft(String(safe))}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
        setDraft(digits);
        if (digits === "") {
          onCommit(0);
          return;
        }
        const parsed = Number.parseInt(digits, 10);
        if (!Number.isFinite(parsed)) {
          onCommit(0);
          return;
        }
        onCommit(Math.min(FOLLOWER_HEADCOUNT_INPUT_MAX, Math.max(0, parsed)));
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

function mergeServerDraftIntoForm(defaults: CampaignSetupFormData, raw: unknown): CampaignSetupFormData {
  if (!isFunnelDraftData(raw)) return defaults;
  const d = raw as Partial<FunnelDraftPayload> & Pick<FunnelDraftPayload, "step1">;
  const s2 = d.step2;
  return {
    step1: { ...defaults.step1, ...d.step1 },
    step2: {
      ...defaults.step2,
      ...(s2 ?? {}),
      draftPlace: { ...defaults.step2.draftPlace, ...(s2?.draftPlace ?? {}) },
      places: Array.isArray(s2?.places) ? s2.places : defaults.step2.places,
    },
    step3: { ...defaults.step3, ...d.step3 },
  };
}

export function CampaignSetupFunnelForm({
  initialDraftId,
  initialDraftData,
  initialStep,
  initialBrandProfile,
}: {
  initialDraftId?: string;
  initialDraftData?: unknown;
  initialStep?: number;
  initialBrandProfile?: BrandContactStep1;
}) {
  const router = useRouter();
  const [step, setStep] = useState(() =>
    initialStep !== undefined && initialStep >= 1 && initialStep <= 3 ? initialStep : 1,
  );
  const [draftId, setDraftId] = useState(initialDraftId ?? "");
  const [formData, setFormData] = useState<CampaignSetupFormData>(() => {
    const fromDraft = mergeServerDraftIntoForm(defaultData, initialDraftData);
    if (!initialBrandProfile) return fromDraft;
    return {
      ...fromDraft,
      step1: mergeBrandProfileIntoStep1(fromDraft.step1, initialBrandProfile),
    };
  });
  const [savingServer, setSavingServer] = useState(false);
  const [savedAtServer, setSavedAtServer] = useState("");
  const [serverError, setServerError] = useState("");
  const [finalizing, setFinalizing] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isClinic = formData.step1.placeType === "CLINIC";
  const purposeOptions = isClinic ? CLINIC_PURPOSE_OPTIONS : DEFAULT_PURPOSE_OPTIONS;
  const validPurposeSet = useMemo(() => new Set(purposeOptions), [purposeOptions]);
  const visiblePurposeCount = useMemo(
    () => formData.step1.visitPurposes.filter((purpose) => validPurposeSet.has(purpose as (typeof purposeOptions)[number])).length,
    [formData.step1.visitPurposes, validPurposeSet],
  );
  const isProductBenefitOn = formData.step2.hasBenefits === "YES" && formData.step2.benefitTypes.includes("PRODUCT");
  const progressPercent = (step / stepTitles.length) * 100;

  const pricingSummary = useMemo(() => {
    const underCount = Math.max(0, formData.step3.followerCountUnder5k);
    const overCount = Math.max(0, formData.step3.followerCountOver5k);
    const underTotal = underCount * UNIT_PRICE_UNDER_5K;
    const overTotal = overCount * UNIT_PRICE_OVER_5K;
    const headcount = underCount + overCount;
    const subtotal = underTotal + overTotal;
    const vat = Math.round(subtotal * 0.1);
    const totalPrice = subtotal + vat;

    return {
      underCount,
      overCount,
      underTotal,
      overTotal,
      headcount,
      subtotal,
      vat,
      totalPrice,
    };
  }, [formData.step3.followerCountOver5k, formData.step3.followerCountUnder5k]);

  const cannotProceedFromStep2 = useMemo(() => {
    const invalidExplicit = formData.step2.places.some((p) => !isValidFunnelPlaceRow(p));
    const hasVenue = effectiveFunnelPlaces(formData.step2).length > 0;
    return invalidExplicit || !hasVenue;
  }, [formData.step2]);

  const loadedFromServer = Boolean(initialDraftId && initialDraftData && isFunnelDraftData(initialDraftData));

  const { saveNow, lastSavedAt, toastMessage } = useCampaignFormAutosave<CampaignSetupFormData>({
    storageKey: `klink:campaign-setup:funnel:${draftId || initialDraftId || "new"}`,
    data: formData,
    skipRestore: loadedFromServer,
    onRestore: (restored) =>
      setFormData((prev) => ({
        ...prev,
        ...restored,
        step1: { ...prev.step1, ...(restored.step1 ?? {}) },
        step2: {
          ...prev.step2,
          ...(restored.step2 ?? {}),
          draftPlace: { ...prev.step2.draftPlace, ...(restored.step2?.draftPlace ?? {}) },
          places: restored.step2?.places ?? prev.step2.places,
        },
        step3: { ...prev.step3, ...(restored.step3 ?? {}) },
      })),
  });

  async function saveDraftServer(mode: "manual" | "auto"): Promise<string | null> {
    const canSync =
      Boolean(draftId) ||
      formData.step1.contactBrandName.trim().length > 0 ||
      formData.step1.campaignName.trim().length > 0;
    if (!canSync && mode === "auto") return draftId || null;

    setSavingServer(true);
    if (mode === "manual") setServerError("");
    const payload = {
      name:
        formData.step1.campaignName?.trim() ||
        formData.step1.contactBrandName?.trim() ||
        "방문형 콘텐츠 캠페인",
      currentStep: step,
      data: {
        formKind: "funnel" as const,
        step1: formData.step1,
        step2: formData.step2,
        step3: formData.step3,
      },
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
      const json = (await response.json()) as { draftId?: string; error?: string };
      if (!response.ok) throw new Error(typeof json.error === "string" ? json.error : "저장 실패");
      let effectiveId = draftId;
      if (!draftId && json.draftId) {
        effectiveId = json.draftId;
        setDraftId(json.draftId);
        router.replace(`/campaign/setup/${json.draftId}`);
      }
      setSavedAtServer(
        new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      );
      saveNow();
      return effectiveId;
    } catch (e) {
      if (mode === "manual") setServerError(e instanceof Error ? e.message : "서버 저장에 실패했습니다.");
      return null;
    } finally {
      setSavingServer(false);
    }
  }

  async function finalizeCampaign() {
    const idFromState = draftId;
    let pendingTab: WindowProxy | null = null;
    if (idFromState) {
      pendingTab = openFinalizePendingTab(idFromState);
    }

    setFinalizing(true);
    setServerError("");
    try {
      let id = idFromState;
      if (!id) {
        id = (await saveDraftServer("manual")) ?? "";
      }
      if (!id) {
        pendingTab?.close();
        setServerError("저장에 실패했거나 초안 ID를 확인할 수 없습니다. 필수 정보를 입력한 뒤 다시 시도해 주세요.");
        return;
      }

      if (pendingTab && !pendingTab.closed) {
        setSubmitSuccessMessage(
          "새 창에서 제출 처리 후 결제·인보이스 안내가 열립니다. 새 창을 닫지 말고 안내를 따라 주세요.",
        );
        return;
      }

      router.push(`/campaign/setup/complete/pending?draftId=${encodeURIComponent(id)}`);
      setSubmitSuccessMessage("결제·인보이스 안내 페이지로 이동합니다.");
    } catch {
      pendingTab?.close();
      setServerError("제출 중 오류가 발생했습니다. 네트워크를 확인한 뒤 다시 시도해 주세요.");
    } finally {
      setFinalizing(false);
    }
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void saveDraftServer("auto"), 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, step, draftId]);

  useEffect(() => {
    const id = setInterval(() => void saveDraftServer("auto"), 300000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, step, draftId]);

  useEffect(() => {
    setFormData((prev) => {
      const filteredPurposes = prev.step1.visitPurposes.filter((purpose) =>
        validPurposeSet.has(purpose as (typeof purposeOptions)[number]),
      );
      if (filteredPurposes.length === prev.step1.visitPurposes.length) return prev;
      return {
        ...prev,
        step1: {
          ...prev.step1,
          visitPurposes: filteredPurposes,
        },
      };
    });
  }, [validPurposeSet, purposeOptions]);

  function goNext() {
    if (step === 2 && cannotProceedFromStep2) return;
    setStep((prev) => Math.min(3, prev + 1));
  }

  function goPrev() {
    setStep((prev) => Math.max(1, prev - 1));
  }

  function addPlace() {
    const draft = formData.step2.draftPlace;
    if (
      !draft.visitCountry ||
      !draft.address ||
      !draft.eventStartDate ||
      !draft.eventEndDate ||
      !draft.operationStartTime ||
      !draft.operationEndTime
    ) {
      return;
    }
    if (draft.eventEndDate < draft.eventStartDate || draft.operationEndTime <= draft.operationStartTime) return;
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        places: [
          ...prev.step2.places,
          {
            visitCountry: draft.visitCountry,
            address: draft.address,
            placeDescription: draft.placeDescription,
            eventStartDate: draft.eventStartDate,
            eventEndDate: draft.eventEndDate,
            operationStartTime: draft.operationStartTime,
            operationEndTime: draft.operationEndTime,
          },
        ],
        draftPlace: {
          ...prev.step2.draftPlace,
          address: "",
          placeDescription: "",
          eventStartDate: "",
          eventEndDate: "",
          operationStartTime: "",
          operationEndTime: "",
        },
      },
    }));
  }

  function removePlaceAt(index: number) {
    setFormData((prev) => ({
      ...prev,
      step2: {
        ...prev.step2,
        places: prev.step2.places.filter((_, i) => i !== index),
      },
    }));
  }

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-pink-100/40 via-white/0 to-transparent" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <Card className={cn(cardBase, "overflow-hidden")}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-heading text-2xl">캠페인 세팅</CardTitle>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={savingServer}
                    onClick={() => void saveDraftServer("manual")}
                    className="gap-2 border-zinc-300 bg-white hover:bg-zinc-50"
                  >
                    <Save className="size-4" />
                    {savingServer ? "서버 저장 중..." : "서버에 임시 저장"}
                  </Button>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                    <span>
                      Step {step} / {stepTitles.length}
                    </span>
                    <span>{stepTitles[step - 1]}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100">
                    <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-zinc-500 sm:grid-cols-3">
                    {stepTitles.map((title, idx) => (
                      <p
                        key={title}
                        className={cn(
                          "rounded-lg border px-2 py-1.5 transition",
                          step === idx + 1
                            ? "border-primary/30 bg-primary/8 font-semibold text-primary"
                            : "border-zinc-200 bg-zinc-50 text-zinc-500",
                        )}
                      >
                        {idx + 1}. {title}
                      </p>
                    ))}
                  </div>
                </div>
                {submitSuccessMessage ? (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-sm text-emerald-800" role="status">
                    {submitSuccessMessage}
                  </p>
                ) : null}
                {serverError ? (
                  <p className="text-sm text-destructive" role="alert">
                    {serverError}
                  </p>
                ) : null}
              </CardHeader>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="font-heading text-xl">{stepTitles[step - 1]}</CardTitle>
                <CardDescription>{stepDescriptions[step - 1]}</CardDescription>
              </CardHeader>
              <CardContent>
                <div key={step} className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
                  {step === 1 ? (
                    <>
                      <div className={sectionCard}>
                        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-primary">
                          <Sparkles className="size-3.5" />
                          1. 기본 정보
                        </p>
                        <h3 className="mb-4 text-lg font-semibold tracking-tight text-zinc-900">담당자 정보를 알려주세요</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contactBrandName">회사 / 브랜드명 *</Label>
                            <Input
                              id="contactBrandName"
                              required
                              value={formData.step1.contactBrandName}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step1: { ...prev.step1, contactBrandName: e.target.value },
                                }))
                              }
                              placeholder="예: K-LINK Beauty"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactManagerProfile">직함, 담당자 이름 *</Label>
                            <Input
                              id="contactManagerProfile"
                              required
                              value={formData.step1.contactManagerProfile}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step1: { ...prev.step1, contactManagerProfile: e.target.value },
                                }))
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
                              value={formData.step1.contactEmail}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step1: { ...prev.step1, contactEmail: e.target.value },
                                }))
                              }
                              placeholder="you@brand.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">연락처 *</Label>
                            <Input
                              id="contactPhone"
                              type="tel"
                              required
                              value={formData.step1.contactPhone}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step1: { ...prev.step1, contactPhone: e.target.value },
                                }))
                              }
                              placeholder="예: 010-1234-5678"
                            />
                          </div>
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-primary">
                          <Sparkles className="size-3.5" />
                          STEP 1
                        </p>
                        <div className="space-y-2">
                        <Label htmlFor="campaignName">캠페인 이름</Label>
                        <Input
                          id="campaignName"
                          placeholder="예: OO브랜드 성수 팝업스토어 방문 콘텐츠"
                          value={formData.step1.campaignName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, step1: { ...prev.step1, campaignName: e.target.value } }))
                          }
                        />
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <div className="space-y-2">
                        <Label htmlFor="placeType">방문 장소 유형</Label>
                        <select
                          id="placeType"
                          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                          value={formData.step1.placeType}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              step1: {
                                ...prev.step1,
                                placeType: e.target.value,
                                visitPurposes: [],
                              },
                            }))
                          }
                        >
                          <option value="">선택해 주세요</option>
                          {PLACE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        </div>
                      </div>

                      {formData.step1.placeType === "OTHER" ? (
                        <div className={cn(sectionCard, "space-y-2 animate-in fade-in-0 slide-in-from-top-1 duration-300")}>
                          <Label htmlFor="placeTypeCustom">기타 장소 입력</Label>
                          <Input
                            id="placeTypeCustom"
                            placeholder="예: 호텔 라운지 / 복합문화공간"
                            value={formData.step1.placeTypeCustom}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, step1: { ...prev.step1, placeTypeCustom: e.target.value } }))
                            }
                          />
                        </div>
                      ) : null}

                      <div className={sectionCard}>
                        <Label>방문/콘텐츠 목적 (복수 선택)</Label>
                        <details className="group mt-2 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3">
                          <summary className="cursor-pointer list-none text-sm font-medium text-zinc-700">
                            목적 선택하기 ({visiblePurposeCount}개 선택됨)
                          </summary>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                            {purposeOptions.map((purpose) => (
                              <label key={purpose} className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={formData.step1.visitPurposes.includes(purpose)}
                                  onChange={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      step1: {
                                        ...prev.step1,
                                        visitPurposes: toggleArrayItem(prev.step1.visitPurposes, purpose),
                                      },
                                    }))
                                  }
                                />
                                {purpose}
                              </label>
                            ))}
                          </div>
                        </details>
                        {isClinic ? <p className="text-xs text-primary">병원/클리닉 선택 시 전용 목적 옵션으로 자동 변경됩니다.</p> : null}
                      </div>
                    </>
                  ) : null}

                  {step === 2 ? (
                    <>
                      <div className={sectionCard}>
                        <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-primary">
                          <CalendarDays className="size-3.5" />
                          방문 지역/장소/일정 추가
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="visitCountry">방문 지역(국가)</Label>
                          <select
                            id="visitCountry"
                            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                            value={formData.step2.draftPlace.visitCountry}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                step2: {
                                  ...prev.step2,
                                  draftPlace: { ...prev.step2.draftPlace, visitCountry: e.target.value },
                                },
                              }))
                            }
                          >
                            <option value="">선택해 주세요</option>
                            {REGION_VALUES.map((region) => (
                              <option key={region} value={region}>
                                {regionLabel[region]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">정확한 주소</Label>
                          <Input
                            id="address"
                            placeholder="예: 서울시 성동구 성수이로 XX"
                            value={formData.step2.draftPlace.address}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                step2: {
                                  ...prev.step2,
                                  draftPlace: { ...prev.step2.draftPlace, address: e.target.value },
                                },
                              }))
                            }
                          />
                        </div>
                      </div>

                        <div className="mt-4 space-y-2">
                        <Label htmlFor="placeDescription">장소 설명</Label>
                        <Textarea
                          id="placeDescription"
                          rows={3}
                          placeholder="예: 팝업 존 위치, 촬영 가능 구역, 현장 동선 등"
                          value={formData.step2.draftPlace.placeDescription}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              step2: {
                                ...prev.step2,
                                draftPlace: { ...prev.step2.draftPlace, placeDescription: e.target.value },
                              },
                            }))
                          }
                        />
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="eventStartDate">방문 시작일</Label>
                            <Input
                              id="eventStartDate"
                              type="date"
                              value={formData.step2.draftPlace.eventStartDate}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step2: {
                                    ...prev.step2,
                                    draftPlace: { ...prev.step2.draftPlace, eventStartDate: e.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventEndDate">방문 종료일</Label>
                            <Input
                              id="eventEndDate"
                              type="date"
                              value={formData.step2.draftPlace.eventEndDate}
                              min={formData.step2.draftPlace.eventStartDate || undefined}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step2: {
                                    ...prev.step2,
                                    draftPlace: { ...prev.step2.draftPlace, eventEndDate: e.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="operationStartTime">운영 시작 시간</Label>
                            <Input
                              id="operationStartTime"
                              type="time"
                              value={formData.step2.draftPlace.operationStartTime}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step2: {
                                    ...prev.step2,
                                    draftPlace: { ...prev.step2.draftPlace, operationStartTime: e.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="operationEndTime">운영 종료 시간</Label>
                            <Input
                              id="operationEndTime"
                              type="time"
                              value={formData.step2.draftPlace.operationEndTime}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step2: {
                                    ...prev.step2,
                                    draftPlace: { ...prev.step2.draftPlace, operationEndTime: e.target.value },
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button type="button" variant="outline" onClick={addPlace} className="gap-1.5">
                            <Plus className="size-4" />
                            추가하기
                          </Button>
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] text-primary">
                          <CalendarDays className="size-3.5" />
                          추가된 방문 장소 / 일정
                        </p>
                        <div className="space-y-3">
                          {formData.step2.places.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                              위 입력란만 채워도 다음 단계로 진행할 수 있습니다. 여러 장소·일정이 있을 때만 추가하기로 목록에 더 넣어 주세요.
                            </p>
                          ) : null}

                          {formData.step2.places.map((place, index) => {
                            return (
                              <div key={`${place.address}-${index}`} className="rounded-lg border border-zinc-200 bg-zinc-50/80 p-3">
                                <div className="mb-2 flex items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-zinc-800">
                                    {REGION_VALUES.includes(place.visitCountry as (typeof REGION_VALUES)[number])
                                      ? regionLabel[place.visitCountry as (typeof REGION_VALUES)[number]]
                                      : place.visitCountry}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => removePlaceAt(index)}
                                    className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700"
                                  >
                                    <Trash2 className="size-3.5" />
                                    삭제
                                  </button>
                                </div>
                                <p className="text-sm text-zinc-700">{place.address}</p>
                                {place.placeDescription ? <p className="mt-1 text-xs text-zinc-500">{place.placeDescription}</p> : null}
                                <p className="mt-2 text-xs text-zinc-600">
                                  일정: {place.eventStartDate} ~ {place.eventEndDate} / {place.operationStartTime} ~ {place.operationEndTime}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <Label>제공 혜택 / 선물</Label>
                        <div className="mt-2 flex gap-2">
                          <Button
                            type="button"
                            variant={formData.step2.hasBenefits === "YES" ? "default" : "outline"}
                            onClick={() => setFormData((prev) => ({ ...prev, step2: { ...prev.step2, hasBenefits: "YES" } }))}
                          >
                            있음
                          </Button>
                          <Button
                            type="button"
                            variant={formData.step2.hasBenefits === "NO" ? "default" : "outline"}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                step2: {
                                  ...prev.step2,
                                  hasBenefits: "NO",
                                  benefitTypes: [],
                                  productDetails: "",
                                  productEstimatedValue: "",
                                },
                              }))
                            }
                          >
                            없음
                          </Button>
                        </div>
                      </div>

                      {formData.step2.hasBenefits === "YES" ? (
                        <div className={cn(sectionCard, "space-y-3 animate-in fade-in-0 slide-in-from-top-1 duration-300")}>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {BENEFIT_VALUES.map((benefit) => (
                              <label key={benefit} className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={formData.step2.benefitTypes.includes(benefit)}
                                  onChange={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      step2: {
                                        ...prev.step2,
                                        benefitTypes: toggleArrayItem(prev.step2.benefitTypes, benefit),
                                      },
                                    }))
                                  }
                                />
                                {benefitLabel[benefit]}
                              </label>
                            ))}
                          </div>

                          {formData.step2.benefitTypes.includes("OTHER") ? (
                            <Input
                              placeholder="기타 혜택 내용을 입력해 주세요"
                              value={formData.step2.benefitOtherText}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, step2: { ...prev.step2, benefitOtherText: e.target.value } }))
                              }
                            />
                          ) : null}

                          {isProductBenefitOn ? (
                            <div className="grid gap-3 sm:grid-cols-2 animate-in fade-in-0 slide-in-from-top-1 duration-300">
                              <Input
                                placeholder="제품 제공 내용 (예: 세럼 1세트)"
                                value={formData.step2.productDetails}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, step2: { ...prev.step2, productDetails: e.target.value } }))
                                }
                              />
                              <Input
                                type="number"
                                min={0}
                                placeholder="예상 가치 (원)"
                                value={formData.step2.productEstimatedValue}
                                onChange={(e) =>
                                  setFormData((prev) => ({ ...prev, step2: { ...prev.step2, productEstimatedValue: e.target.value } }))
                                }
                              />
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  ) : null}

                  {step === 3 ? (
                    <>
                      <div className={sectionCard}>
                        <div className="space-y-2">
                          <Label>타겟 국가 (복수 선택 가능)</Label>
                          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
                            {REGION_VALUES.map((region) => (
                              <button
                                key={region}
                                type="button"
                                className={cn(
                                  "shrink-0 rounded-full border px-3 py-1.5 text-sm transition",
                                  formData.step3.targetCountries.includes(region)
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400",
                                )}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    step3: {
                                      ...prev.step3,
                                      targetCountries: toggleArrayItem(prev.step3.targetCountries, region),
                                    },
                                  }))
                                }
                              >
                                {regionLabel[region]}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <Label>팔로워 구간별 인플루언서 수</Label>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          <div className="rounded-lg border border-zinc-200 bg-white p-3">
                            <p className="text-sm font-semibold text-zinc-800">5000 미만</p>
                            <p className="mt-0.5 text-xs text-zinc-500">1인 {UNIT_PRICE_UNDER_5K.toLocaleString()}원</p>
                            <FollowerHeadcountInput
                              id="follower-count-under-5k"
                              aria-label="팔로워 5000 미만 구간 인플루언서 수"
                              className="mt-2"
                              value={formData.step3.followerCountUnder5k}
                              onCommit={(n) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step3: { ...prev.step3, followerCountUnder5k: n },
                                }))
                              }
                            />
                          </div>
                          <div className="rounded-lg border border-fuchsia-200 bg-fuchsia-50/55 p-3">
                            <p className="text-sm font-semibold text-zinc-800">5000 이상</p>
                            <p className="mt-0.5 text-xs text-fuchsia-700">1인 {UNIT_PRICE_OVER_5K.toLocaleString()}원</p>
                            <FollowerHeadcountInput
                              id="follower-count-over-5k"
                              aria-label="팔로워 5000 이상 구간 인플루언서 수"
                              className="mt-2 border-fuchsia-200 bg-white"
                              value={formData.step3.followerCountOver5k}
                              onCommit={(n) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  step3: { ...prev.step3, followerCountOver5k: n },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-zinc-500">
                          예: 5000 이하 5명, 5000 이상 3명과 같이 혼합 구성이 가능합니다.
                        </p>
                      </div>

                      <div className={sectionCard}>
                        <Label>플랫폼 선택 (복수)</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {PLATFORM_VALUES.map((platform) => {
                            const selected = formData.step3.platforms.includes(platform);
                            return (
                              <button
                                key={platform}
                                type="button"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    step3: {
                                      ...prev.step3,
                                      platforms: toggleArrayItem(prev.step3.platforms, platform),
                                    },
                                  }))
                                }
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-sm transition",
                                  selected ? "border-primary bg-primary/10 text-primary" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400",
                                )}
                              >
                                {platformLabel[platform]}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className={sectionCard}>
                        <Label htmlFor="extraRequests">추가 요청 사항</Label>
                        <p className="text-xs text-zinc-500">
                          추가 조건이 있는 경우 자유롭게 작성해 주세요. 세부 사항은 협의를 통해 조정됩니다.
                        </p>
                        <Textarea
                          id="extraRequests"
                          rows={4}
                          placeholder="예: 피부 시술 전/후 비교샷은 제외, 영어권 크리에이터 우선 등"
                          value={formData.step3.extraRequests}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, step3: { ...prev.step3, extraRequests: e.target.value } }))
                          }
                        />
                      </div>
                    </>
                  ) : null}
                </div>

                <div className="mt-7 flex flex-wrap justify-center gap-3 border-t border-zinc-200 pt-5">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={goPrev}>
                      이전
                    </Button>
                  ) : null}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={step === 2 && cannotProceedFromStep2}
                      className="bg-[#ff2f9b] text-white hover:bg-[#e61c8d]"
                    >
                      다음
                    </Button>
                  ) : null}
                  {step === 3 ? (
                    <Button
                      type="button"
                      size="lg"
                      disabled={finalizing || savingServer}
                      onClick={() => void finalizeCampaign()}
                      className="gap-2 bg-[#ff2f9b] text-white hover:bg-[#e61c8d]"
                    >
                      {finalizing ? "제출 중…" : "제출하기"}
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Card className={cn(cardBase, "bg-linear-to-b from-white to-zinc-50")}>
              <CardHeader>
                <CardTitle className="text-lg">실시간 견적 힌트</CardTitle>
                <CardDescription>구간별 인원 입력과 동시에 견적이 실시간 반영됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span>5000 미만 ({pricingSummary.underCount}명)</span>
                  <span className="font-medium">{pricingSummary.underTotal.toLocaleString()}원</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>5000 이상 ({pricingSummary.overCount}명)</span>
                  <span className={cn("font-medium", pricingSummary.overTotal > 0 ? "text-fuchsia-600" : "text-zinc-700")}>
                    {pricingSummary.overTotal.toLocaleString()}원
                  </span>
                </p>
                <p className="flex items-center justify-between border-t border-zinc-200 pt-2">
                  <span>합계 금액</span>
                  <span className="font-medium">{pricingSummary.subtotal.toLocaleString()}원</span>
                </p>
                <p className="border-t border-zinc-200 pt-2 text-base font-semibold">
                  부가세 (VAT 10%): <span className="text-primary">{pricingSummary.vat.toLocaleString()}원</span>
                </p>
                <p className="text-base font-semibold">
                  총 예상 금액: <span className="text-primary">{pricingSummary.totalPrice.toLocaleString()}원</span>
                </p>
                <p className="text-xs text-zinc-500">총 인원: {pricingSummary.headcount}명</p>
                <p className="text-xs text-zinc-500">* 최종 금액은 인원/국가/일정 확정 후 안내됩니다.</p>
                <p className="text-xs text-zinc-500">
                  제출하기를 누르면 캠페인이 확정되며, 새 창에서 요약·결제 절차·인보이스·입금 계좌를 한 번에 확인할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className={cardBase}>
              <CardHeader>
                <CardTitle className="text-lg">저장 상태</CardTitle>
                <CardDescription>
                  {savedAtServer ? `서버 저장: ${savedAtServer}` : "서버에 아직 동기화되지 않았습니다."}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600">
                <p>로그인 계정 기준으로 초안이 DB에 저장됩니다. 입력 후 10초·5분마다 자동 동기화됩니다.</p>
                <p className="mt-2">
                  이 기기 로컬: {lastSavedAt ? `마지막 저장 ${lastSavedAt}` : "기록 없음"} (보조 백업)
                </p>
              </CardContent>
            </Card>

            <Card className={cn(cardBase, "bg-white")}>
              <CardHeader>
                <CardTitle className="text-lg">입력 안내</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 text-xs text-zinc-600">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <ShieldCheck className="size-3.5 text-primary" />
                  작성 내용 자동 보호
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <Clock3 className="size-3.5 text-primary" />
                  5분마다 자동 저장
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                  <WandSparkles className="size-3.5 text-primary" />
                  단계별 입력 가이드
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {toastMessage ? (
        <div className="fixed bottom-4 right-4 z-60 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <Check className="size-4" />
            {toastMessage}
          </div>
        </div>
      ) : null}

    </div>
  );
}
