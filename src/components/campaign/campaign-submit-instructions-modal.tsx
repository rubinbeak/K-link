"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CampaignSubmitInstructions } from "@/lib/campaign-submit-instructions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instructions: CampaignSubmitInstructions;
  onConfirm: () => void;
  busy: boolean;
};

const sectionTitle = "text-sm font-semibold text-zinc-900";
const sectionBody = "mt-1.5 text-sm leading-relaxed text-zinc-600";

export function CampaignSubmitInstructionsModal({
  open,
  onOpenChange,
  instructions,
  onConfirm,
  busy,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-end justify-center p-0 sm:items-center sm:p-4" aria-modal="true" role="dialog">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        aria-label="닫기"
        disabled={busy}
        onClick={() => !busy && onOpenChange(false)}
      />
      <div
        className={cn(
          "relative z-71 flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col rounded-t-2xl border border-zinc-200 bg-white shadow-xl sm:rounded-2xl",
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary">제출 전 확인</p>
            <h2 className="mt-1 font-heading text-lg font-semibold text-zinc-900">결제(무통장) 안내</h2>
            <p className="mt-1 text-sm text-zinc-600">
              아래 내용을 확인하신 뒤 제출해 주세요. 제출이 완료되면{" "}
              <span className="font-medium text-zinc-800">인보이스·입금 안내 페이지</span>로 이동합니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 disabled:opacity-40"
            disabled={busy}
            onClick={() => onOpenChange(false)}
            aria-label="창 닫기"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <ol className="space-y-5">
            <li>
              <p className={sectionTitle}>1. 무통장 입금 계좌</p>
              <div className={cn(sectionBody, "rounded-xl border border-zinc-100 bg-zinc-50/80 p-3")}>
                <p>
                  은행: <span className="font-medium text-zinc-800">{instructions.bankName}</span>
                </p>
                <p className="mt-1">
                  계좌번호: <span className="font-medium text-zinc-800">{instructions.accountNumber}</span>
                </p>
                <p className="mt-1">
                  예금주: <span className="font-medium text-zinc-800">{instructions.accountHolder}</span>
                </p>
                <p className="mt-2 border-t border-zinc-200/80 pt-2 text-xs text-zinc-500">{instructions.referenceNote}</p>
              </div>
            </li>
            <li>
              <p className={sectionTitle}>2. 입금 확인 이후 연락</p>
              <p className={sectionBody}>{instructions.postPaymentContact}</p>
            </li>
            <li>
              <p className={sectionTitle}>3. 세금계산서·증빙</p>
              <p className={sectionBody}>{instructions.taxInvoiceProcess}</p>
            </li>
          </ol>
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-zinc-100 bg-zinc-50/50 px-5 py-4 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" disabled={busy} onClick={() => onOpenChange(false)} className="sm:min-w-[100px]">
            돌아가기
          </Button>
          <Button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="gap-1 bg-[#ff2f9b] text-white hover:bg-[#e61c8d] sm:min-w-[180px]"
          >
            {busy ? "제출 중…" : "확인했어요, 제출하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
