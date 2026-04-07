"use client";

import { useMemo, useState } from "react";
import { Activity, CalendarDays, ChevronRight, ClipboardList, Layers, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessStepDetail = {
  title: string;
  paragraphs: readonly string[];
};

const navSlug = (title: string) => title.replace(/^\d+\.\s*/, "");

const statusClass = (status: "done" | "active" | "pending") =>
  status === "done"
    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80"
    : status === "active"
      ? "bg-fuchsia-50 text-fuchsia-800 ring-1 ring-fuchsia-300/80"
      : "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200/80";

const statusLabel = (status: "done" | "active" | "pending") =>
  status === "done" ? "완료" : status === "active" ? "진행 중" : "대기";

/** 단계별 대시보드에 표시할 운영 힌트(데모 수치·SLA 요약) */
const stepOpsMeta: readonly { kpi: string; sla: string; next: string; barLabel: string; barPct: number }[] = [
  { kpi: "견적·조건 확정", sla: "입금 확인 후 24h 내 착수", next: "가이드라인 초안 공유", barLabel: "세팅 완결도", barPct: 92 },
  { kpi: "가이드라인 v1.0", sla: "리스트 납품일 역산", next: "브랜드 컨펌 → 확정본 배포", barLabel: "톤·금지사항 반영률", barPct: 88 },
  { kpi: "후보 풀 스코어링", sla: "방문 D-14 기본 / 최소 D-7", next: "최종 명단·연락처 정리", barLabel: "조건 매칭 적합도", barPct: 96 },
  { kpi: "현장 체크리스트", sla: "당일 에스컬레이션 채널", next: "원본·메타 수급", barLabel: "가이드 준수 체크", barPct: 94 },
  { kpi: "게시 스케줄", sla: "방문 후 D+7 업로드 운영", next: "URL·캡처 납품", barLabel: "일정 이행률", barPct: 91 },
  { kpi: "도달·반응 요약", sla: "업로드 완료 후 D+7 리포트", next: "2차 활용·재캠 제안", barLabel: "리포트 완성도", barPct: 97 },
];

function MiniSparkline({ className }: { className?: string }) {
  const d = "M4 28 L12 22 L20 24 L28 14 L36 18 L44 8 L52 12 L60 6 L68 10 L76 4";
  return (
    <svg className={cn("h-14 w-full", className)} viewBox="0 0 80 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(192 38 211)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(192 38 211)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <path d={`${d} L76 32 L4 32 Z`} fill="url(#spark-fill)" />
      <path d={d} stroke="url(#spark-line)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function ExecutionCalendarStrip({ activeIndex }: { activeIndex: number }) {
  const labels = ["D-14", "D-10", "D-7", "D-3", "방문", "D+3", "D+7"];
  const activeAt = Math.min(6, Math.max(0, activeIndex + 2));
  return (
    <div className="rounded-xl border border-zinc-200/90 bg-zinc-50/80 p-3">
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <CalendarDays className="size-3.5 text-fuchsia-600" />
        실행 플랜 캘린더
      </p>
      <div className="grid grid-cols-7 gap-1">
        {labels.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1">
            <span className="text-[9px] font-medium text-zinc-400">{label}</span>
            <div
              className={cn(
                "h-8 w-full rounded-md transition-colors",
                i === activeAt ? "bg-linear-to-t from-fuchsia-600 to-pink-500 shadow-sm" : "bg-zinc-200/80",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CampaignProcessDetailDashboard({ steps }: { steps: readonly ProcessStepDetail[] }) {
  const [active, setActive] = useState(1);

  const statuses = useMemo(() => {
    return steps.map((_, i) => {
      if (i < active) return "done" as const;
      if (i === active) return "active" as const;
      return "pending" as const;
    });
  }, [active, steps]);

  const meta = stepOpsMeta[active] ?? stepOpsMeta[0];
  const current = steps[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-linear-to-b from-zinc-50/90 to-white shadow-[0_16px_48px_-24px_rgba(15,23,42,0.18)] ring-1 ring-zinc-900/5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 bg-white/90 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
            <LayoutDashboard className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">Campaign cockpit preview</p>
            <p className="font-heading text-sm font-semibold tracking-tight text-zinc-900">6단계 운영 보드 · 설명용 시뮬레이션</p>
          </div>
        </div>
        <span className="rounded-full bg-fuchsia-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-fuchsia-800 ring-1 ring-fuchsia-200/80">
          Demo UI
        </span>
      </div>

      <div className="relative hidden h-[4.25rem] overflow-hidden border-b border-zinc-800/80 bg-linear-to-r from-zinc-950 via-fuchsia-950/90 to-zinc-950 sm:block" aria-hidden>
        <p className="absolute left-4 top-2 z-10 text-[9px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/90">
          Matching flow visual
        </p>
        <svg className="absolute bottom-1 left-0 right-0 h-8 w-full opacity-35" viewBox="0 0 400 32" preserveAspectRatio="none">
          <path
            d="M0 20 Q100 4 200 20 T400 18"
            fill="none"
            stroke="url(#flow-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f472b6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center gap-10 pt-3">
          {["bg-fuchsia-400", "bg-amber-300", "bg-sky-400", "bg-emerald-400", "bg-violet-400"].map((c, i) => (
            <div key={i} className={cn("size-2.5 rounded-full ring-2 ring-white/20", c)} />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(200px,240px)_1fr]">
        <aside className="border-b border-zinc-200/80 bg-zinc-50/50 p-3 sm:p-4 lg:border-b-0 lg:border-r">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Campaign nav</p>
          <nav className="space-y-1" aria-label="프로세스 단계">
            {steps.map((step, i) => {
              const st = statuses[i];
              return (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition",
                    active === i ? "bg-white shadow-sm ring-1 ring-fuchsia-200/70" : "hover:bg-white/80",
                  )}
                >
                  <span className={cn("min-w-0 font-medium", active === i ? "text-zinc-900" : "text-zinc-700")}>
                    <span className="mr-1.5 tabular-nums text-xs text-zinc-400">{i + 1}</span>
                    {navSlug(step.title)}
                  </span>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", statusClass(st))}>
                    {statusLabel(st)}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                <Activity className="size-3.5 text-fuchsia-600" />
                단계 KPI
              </p>
              <p className="mt-2 font-heading text-lg font-bold tracking-tight text-zinc-900">{meta.kpi}</p>
              <p className="mt-1 text-xs text-zinc-500">선택한 단계 기준 요약</p>
            </div>
            <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                <Layers className="size-3.5 text-fuchsia-600" />
                SLA · 기준
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-zinc-800">{meta.sla}</p>
              <p className="mt-1 text-xs text-zinc-500">캠페인별 협의로 조정 가능</p>
            </div>
            <div className="rounded-xl border border-zinc-200/80 bg-white p-3 shadow-sm">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                <ChevronRight className="size-3.5 text-fuchsia-600" />
                다음 마일스톤
              </p>
              <p className="mt-2 text-sm font-semibold leading-snug text-zinc-800">{meta.next}</p>
              <p className="mt-1 text-xs text-zinc-500">운영 보드에서 동일 용어 사용</p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-zinc-800">{meta.barLabel}</p>
                <span className="text-xs font-bold tabular-nums text-fuchsia-700">{meta.barPct}%</span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-fuchsia-500 to-pink-600 transition-[width] duration-500 ease-out"
                  style={{ width: `${meta.barPct}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-zinc-500">예상 추세(샘플)</p>
              <MiniSparkline className="mt-2" />
            </div>
            <ExecutionCalendarStrip activeIndex={active} />
          </div>

          <div className="rounded-xl border border-dashed border-zinc-300/90 bg-zinc-50/60 p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              <ClipboardList className="size-3.5 text-zinc-600" />
              현재 단계 워크플로
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-600">
              {steps.map((s, i) => (
                <span key={s.title} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-lg px-2 py-1",
                      i === active ? "bg-fuchsia-600 text-white shadow-sm" : i < active ? "bg-zinc-200/90 text-zinc-700" : "bg-white text-zinc-500 ring-1 ring-zinc-200",
                    )}
                  >
                    {navSlug(s.title)}
                  </span>
                  {i < steps.length - 1 && <span className="text-zinc-300">→</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <p className="font-heading text-sm font-semibold text-zinc-900">{current.title}</p>
            <div className="mt-3 space-y-2.5 text-sm leading-relaxed text-zinc-600">
              {current.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
