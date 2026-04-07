"use client"

import { useMemo, useState } from "react"
import { CalendarDays, Camera, Globe2, Megaphone, Package, Store, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const campaignTypeOptions = [
  "팝업스토어",
  "박람회 / 페스티벌",
  "매장 오픈",
  "현지 리테일 매장",
  "브랜드 프로모션",
  "병원 / 클리닉 홍보",
  "F&B",
  "기타",
] as const

const goalOptions = [
  { value: "increase-visitors", label: "방문 고객 늘리기", icon: Users },
  { value: "increase-awareness", label: "브랜드 알리기", icon: Megaphone },
  { value: "promote-products", label: "제품 홍보", icon: Package },
  { value: "increase-retail-sales", label: "리테일 매장 판매 / 매출 증가", icon: Store },
  { value: "attract-global-customers", label: "외국인 고객 / 환자 유치", icon: Globe2 },
  { value: "secure-contents", label: "콘텐츠 확보", icon: Camera },
] as const

const influencerScaleOptions = ["1~5명", "5~10명", "10~30명", "30명 이상", "미정/상담 필요"] as const

const benefitOptions = ["제품 제공", "체험 제공", "식사 제공", "교통 지원", "출연료 지급", "아직 미정"] as const
const CONSULTING_SCHEDULE_URL =
  "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ37NCBmhl83UEe-cRgObQXzeJhAxkb5dSbYyHhQfqbcaLhKmVSBRlCWgbBvnUmMlBezE4lVNxgG"

type FormErrors = {
  campaignTypes?: string
  goals?: string
  influencerScale?: string
  benefits?: string
  dateRange?: string
}

function toggleMultiValue(values: string[], target: string) {
  return values.includes(target) ? values.filter((item) => item !== target) : [...values, target]
}

export function ConsultingForm() {
  const [campaignTypes, setCampaignTypes] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [influencerScale, setInfluencerScale] = useState<string>("")
  const [benefits, setBenefits] = useState<string[]>([])
  const [eventStartDate, setEventStartDate] = useState("")
  const [eventEndDate, setEventEndDate] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [requestSaving, setRequestSaving] = useState(false)
  const [requestSaved, setRequestSaved] = useState(false)
  const [showThanksBanner, setShowThanksBanner] = useState(false)

  const isUndecidedBenefit = benefits.includes("아직 미정")

  const summary = useMemo(
    () => ({
      campaignTypes,
      goals: goalOptions.filter((goal) => goals.includes(goal.value)).map((goal) => goal.label),
      influencerScale,
      benefits,
      period: eventStartDate && eventEndDate ? `${eventStartDate} ~ ${eventEndDate}` : "",
    }),
    [campaignTypes, eventEndDate, eventStartDate, goals, influencerScale, benefits],
  )

  function handleBenefitToggle(value: string) {
    if (value === "아직 미정") {
      setBenefits((prev) => (prev.includes("아직 미정") ? [] : ["아직 미정"]))
      return
    }
    setBenefits((prev) => {
      const withoutUndecided = prev.filter((item) => item !== "아직 미정")
      return toggleMultiValue(withoutUndecided, value)
    })
  }

  function validate() {
    const nextErrors: FormErrors = {}
    if (campaignTypes.length === 0) nextErrors.campaignTypes = "행사 / 캠페인 유형을 1개 이상 선택해 주세요."
    if (goals.length === 0) nextErrors.goals = "이번 캠페인의 주요 목표를 1개 이상 선택해 주세요."
    if (!influencerScale) nextErrors.influencerScale = "희망 인플루언서 규모를 선택해 주세요."
    if (benefits.length === 0) nextErrors.benefits = "제공 가능한 혜택을 1개 이상 선택해 주세요."
    if (!eventStartDate || !eventEndDate) {
      nextErrors.dateRange = "행사 일정의 시작일과 종료일을 모두 선택해 주세요."
    } else if (eventStartDate > eventEndDate) {
      nextErrors.dateRange = "행사 종료일은 시작일 이후여야 합니다."
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(false)
    if (!validate()) return
    setSubmitted(true)
    setRequestSaved(false)
    setShowThanksBanner(false)
  }

  async function submitConsultingRequest() {
    if (!submitted || requestSaving || requestSaved) return

    setRequestSaving(true)
    setShowThanksBanner(false)

    window.open(CONSULTING_SCHEDULE_URL, "_blank", "noopener,noreferrer")
    setRequestSaved(true)
    setRequestSaving(false)

    window.setTimeout(() => {
      setShowThanksBanner(true)
    }, 1400)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7 sm:space-y-8">
      <section className="rounded-2xl border border-white/60 bg-zinc-50/70 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">1. 기본 정보</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">담당자 정보를 알려주세요</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-[13px] tracking-tight text-zinc-700">회사 / 브랜드명 *</Label>
            <Input id="brandName" name="brandName" required placeholder="예: K-LINK Beauty" className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerProfile" className="text-[13px] tracking-tight text-zinc-700">직함, 담당자 이름 *</Label>
            <Input id="managerProfile" name="managerProfile" required placeholder="예: 마케팅 매니저 김민지" className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[13px] tracking-tight text-zinc-700">이메일 *</Label>
            <Input id="email" name="email" type="email" required placeholder="you@brand.com" className="h-10" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[13px] tracking-tight text-zinc-700">연락처 *</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="예: 010-1234-5678" className="h-10" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/60 bg-zinc-50/70 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">2. 행사 / 캠페인 정보</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">캠페인 컨텍스트를 알려주세요</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="eventName" className="text-[13px] tracking-tight text-zinc-700">행사명</Label>
            <Input id="eventName" name="eventName" placeholder="예: 2026 서울 뷰티 팝업" className="h-10" />
          </div>

          <div className="space-y-2">
            <Label className="text-[13px] tracking-tight text-zinc-700">행사 / 캠페인 유형 *</Label>
            <div className="flex flex-wrap gap-2">
              {campaignTypeOptions.map((option) => {
                const selected = campaignTypes.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-sm font-medium tracking-tight transition",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",
                    )}
                    onClick={() => setCampaignTypes((prev) => toggleMultiValue(prev, option))}
                    aria-pressed={selected}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {errors.campaignTypes ? <p className="text-xs text-destructive">{errors.campaignTypes}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="eventLocation" className="text-[13px] tracking-tight text-zinc-700">행사 국가 / 도시 *</Label>
              <Input id="eventLocation" name="eventLocation" required placeholder="예: 태국 방콕" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="justify-center text-[13px] tracking-tight text-zinc-700">행사 일정 *</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500">시작일</span>
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-3 top-2.5 text-zinc-400">
                      <CalendarDays className="size-4" />
                    </span>
                    <Input
                      type="date"
                      name="eventStartDate"
                      className="h-10 pl-9"
                      value={eventStartDate}
                      onChange={(e) => setEventStartDate(e.target.value)}
                      required
                    />
                  </span>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500">종료일</span>
                  <span className="relative block">
                    <span className="pointer-events-none absolute left-3 top-2.5 text-zinc-400">
                      <CalendarDays className="size-4" />
                    </span>
                    <Input
                      type="date"
                      name="eventEndDate"
                      className="h-10 pl-9"
                      value={eventEndDate}
                      onChange={(e) => setEventEndDate(e.target.value)}
                      min={eventStartDate || undefined}
                      required
                    />
                  </span>
                </label>
              </div>
              {errors.dateRange ? <p className="text-xs text-destructive">{errors.dateRange}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-primary/15 bg-primary/5 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">3. 이번 캠페인의 목적 (가장 중요)</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">주요 목표를 선택해 주세요 *</h2>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {goalOptions.map((goal) => {
            const selected = goals.includes(goal.value)
            const Icon = goal.icon
            return (
              <button
                key={goal.value}
                type="button"
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-medium tracking-tight transition",
                  selected
                    ? "border-primary bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(224,72,153,0.35)]"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50",
                )}
                onClick={() => setGoals((prev) => toggleMultiValue(prev, goal.value))}
                aria-pressed={selected}
              >
                <Icon className="size-4 shrink-0" />
                <span>{goal.label}</span>
              </button>
            )
          })}
        </div>
        {errors.goals ? <p className="mt-2 text-xs text-destructive">{errors.goals}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/60 bg-zinc-50/70 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">4. 희망 인플루언서 규모</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">희망 인플루언서 수를 바로 선택해 주세요 *</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {influencerScaleOptions.map((option) => {
            const selected = influencerScale === option
            return (
              <button
                key={option}
                type="button"
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-semibold tracking-tight transition",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400",
                )}
                onClick={() => setInfluencerScale(option)}
                aria-pressed={selected}
              >
                {option}
              </button>
            )
          })}
        </div>
        {errors.influencerScale ? <p className="mt-2 text-xs text-destructive">{errors.influencerScale}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/60 bg-zinc-50/70 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">5. 제공 가능한 혜택</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">인플루언서에게 제공 가능한 것을 선택해 주세요 *</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {benefitOptions.map((option) => {
            const selected = benefits.includes(option)
            const disabled = isUndecidedBenefit && option !== "아직 미정"
            return (
              <button
                key={option}
                type="button"
                disabled={disabled}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium tracking-tight transition",
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",
                  disabled && "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400",
                )}
                onClick={() => handleBenefitToggle(option)}
                aria-pressed={selected}
              >
                {option}
              </button>
            )
          })}
        </div>
        {errors.benefits ? <p className="mt-2 text-xs text-destructive">{errors.benefits}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/60 bg-zinc-50/70 p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-[11px] font-semibold tracking-widest text-primary">6. 기타 요청 사항 (선택)</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900">추가 전달 내용</h2>
        </div>
        <div className="space-y-2">
          <Label htmlFor="additionalNotes" className="text-[13px] tracking-tight text-zinc-700">추가로 전달하고 싶은 내용</Label>
          <Textarea
            id="additionalNotes"
            name="additionalNotes"
            className="min-h-32 leading-6"
            placeholder="예: 특정 국가의 인플루언서를 선호하시거나, 레퍼런스로 삼고 싶은 캠페인 링크가 있다면 남겨주세요."
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button type="submit" size="lg">
          내용 확인하기
        </Button>
        <Button
          type="button"
          size="lg"
          variant={submitted ? "default" : "outline"}
          disabled={!submitted || requestSaving || requestSaved}
          onClick={submitConsultingRequest}
          className={cn(submitted ? "shadow-[0_0_0_4px_rgba(224,72,153,0.18)]" : "")}
        >
          {requestSaving ? "제출 중..." : requestSaved ? "제출 완료" : "제출하기"}
        </Button>
      </div>

      {requestSaved ? (
        <p className="text-center text-sm font-medium text-primary">
          상담 요청이 저장되었습니다. 예약 페이지가 새 창에서 열렸습니다.
        </p>
      ) : null}

      {showThanksBanner ? (
        <div className="mx-auto w-fit rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
          완료되었습니다. 상담 요청 감사합니다.
        </div>
      ) : null}

      {submitted ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-900">입력 내용이 준비되었습니다.</p>
          <p className="mt-1 text-zinc-600">아래 요약을 확인하고 운영팀 전달 방식(API 연동)으로 바로 확장할 수 있습니다.</p>
          <ul className="mt-3 space-y-1.5 text-zinc-700">
            <li>유형: {summary.campaignTypes.join(", ")}</li>
            <li>주요 목표: {summary.goals.join(", ")}</li>
            <li>희망 인플루언서 수: {summary.influencerScale}</li>
            <li>제공 혜택: {summary.benefits.join(", ")}</li>
            <li>행사 일정: {summary.period}</li>
          </ul>
        </div>
      ) : null}
    </form>
  )
}
