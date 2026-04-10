"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type Phase = "loading" | "redirecting" | "error";

export function FinalizePendingClient() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!draftId?.trim()) {
      setPhase("error");
      setErrorMessage("초안 ID가 없습니다. 캠페인 세팅 화면에서 다시 제출해 주세요.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/campaign-drafts/${encodeURIComponent(draftId)}/finalize`, {
          method: "POST",
          credentials: "same-origin",
        });
        const json = (await res.json()) as { paymentId?: string; error?: string };

        if (cancelled) return;

        if (res.ok && json.paymentId) {
          setPhase("redirecting");
          const path = `/campaign/setup/complete/${json.paymentId}`;
          window.location.replace(`${window.location.origin}${path}`);
          return;
        }

        if (res.status === 409) {
          setPhase("error");
          setErrorMessage("이미 제출이 완료된 초안입니다. 마이페이지에서 캠페인·결제 내역을 확인해 주세요.");
          return;
        }

        setPhase("error");
        setErrorMessage(typeof json.error === "string" ? json.error : "제출 처리에 실패했습니다.");
      } catch {
        if (!cancelled) {
          setPhase("error");
          setErrorMessage("네트워크 오류가 발생했습니다. 연결을 확인한 뒤 다시 시도해 주세요.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [draftId]);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-16">
        {phase === "loading" || phase === "redirecting" ? (
          <div className="rounded-2xl border border-zinc-200/80 bg-white/95 p-8 text-center shadow-lg">
            <Loader2 className="mx-auto size-10 animate-spin text-primary" aria-hidden />
            <h1 className="mt-5 font-heading text-xl font-semibold text-zinc-900">
              {phase === "redirecting" ? "결제 안내로 이동 중…" : "캠페인 제출 처리 중…"}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              잠시만 기다려 주세요. DB에 반영한 뒤 인보이스·입금 안내 화면으로 연결합니다.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200/80 bg-white/95 p-8 shadow-lg">
            <h1 className="font-heading text-xl font-semibold text-zinc-900">제출을 완료할 수 없습니다</h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">{errorMessage}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/campaign/setup" className={cn(buttonVariants({ variant: "outline" }))}>
                캠페인 세팅으로
              </Link>
              <Link href="/brand" className={cn(buttonVariants({ className: "bg-[#ff2f9b] text-white hover:bg-[#e61c8d]" }))}>
                마이페이지
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
