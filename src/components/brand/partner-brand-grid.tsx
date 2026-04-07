"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type PartnerBrandDef = {
  name: string;
  /** Clearbit Logo API 호스트(도메인만). 없으면 이름만 표시 */
  clearbitDomain?: string;
  /** public/ 이하 정적 로고 경로가 있으면 우선 사용 */
  logoSrc?: string;
};

function PartnerBrandMarqueeCell({ partner }: { partner: PartnerBrandDef }) {
  const [failed, setFailed] = useState(false);

  const shellClass =
    "flex h-[4rem] min-w-[10.25rem] shrink-0 items-center justify-center gap-2 rounded-full border border-zinc-200/85 bg-white px-5 shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)] ring-1 ring-zinc-100/90";

  if (partner.logoSrc) {
    return (
      <div className={shellClass}>
        <Image
          src={partner.logoSrc}
          alt={partner.name}
          width={138}
          height={40}
          className="max-h-9 w-auto max-w-36 object-contain object-center"
        />
      </div>
    );
  }

  if (partner.clearbitDomain && !failed) {
    return (
      <div className={shellClass}>
        {/* Clearbit는 next/image 최적화(서버 fetch)를 거치면 DNS/방화벽 환경에서 ENOTFOUND·500이 납니다. 브라우저 직접 로딩으로 전환 */}
        <img
          src={`https://logo.clearbit.com/${partner.clearbitDomain}?size=180&format=svg`}
          alt={partner.name}
          width={138}
          height={40}
          className="max-h-9 w-auto max-w-34 object-contain opacity-90 grayscale transition hover:opacity-100 hover:grayscale-0"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <span className="text-center text-xs font-semibold leading-snug tracking-tight text-zinc-800 break-keep sm:text-sm">
        {partner.name}
      </span>
    </div>
  );
}

function PartnerBrandCell({ partner }: { partner: PartnerBrandDef }) {
  const [failed, setFailed] = useState(false);

  if (partner.logoSrc) {
    return (
      <div className="flex min-h-20 items-center justify-center rounded-xl border border-zinc-100/90 bg-white px-3 py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <Image
          src={partner.logoSrc}
          alt={partner.name}
          width={140}
          height={40}
          className="max-h-9 w-auto max-w-34 object-contain object-center"
        />
      </div>
    );
  }

  if (partner.clearbitDomain && !failed) {
    return (
      <div className="flex min-h-20 items-center justify-center rounded-xl border border-zinc-100/90 bg-white px-3 py-4 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
        <img
          src={`https://logo.clearbit.com/${partner.clearbitDomain}?size=180&format=svg`}
          alt={partner.name}
          width={140}
          height={36}
          className="max-h-8 w-auto max-w-32 object-contain opacity-85 grayscale transition hover:opacity-100 hover:grayscale-0"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-20 items-center justify-center rounded-xl border border-zinc-200/60 bg-zinc-50/90 px-2 py-3 text-center shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
      <span className="text-center text-xs font-semibold leading-snug tracking-tight text-zinc-800 break-keep sm:text-sm">
        {partner.name}
      </span>
    </div>
  );
}

export function PartnerBrandGrid({ partners }: { partners: readonly PartnerBrandDef[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
      {partners.map((p) => (
        <PartnerBrandCell key={p.name} partner={p} />
      ))}
    </div>
  );
}

/** 히어로 등 — 로고·브랜드명 가로 롤링 */
export function PartnerBrandMarquee({
  partners,
  reverse = false,
  className,
  speed = "normal",
}: {
  partners: readonly PartnerBrandDef[];
  reverse?: boolean;
  className?: string;
  speed?: "normal" | "slow";
}) {
  const loop = [...partners, ...partners];
  return (
    <div
      className={cn(
        "brand-marquee -mx-1 sm:mx-0",
        speed === "slow" && "brand-marquee-slow",
        reverse && "brand-marquee-reverse",
        className,
      )}
    >
      <div className="brand-marquee-track items-center gap-3 py-1 pr-3 sm:gap-4">
        {loop.map((p, i) => (
          <PartnerBrandMarqueeCell key={`${p.name}-${i}`} partner={p} />
        ))}
      </div>
    </div>
  );
}
