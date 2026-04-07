"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const heroVideoSources = [
  "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
  "https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_24fps.mp4",
] as const;

const coverageRegions = [
  "🇰🇷 KR",
  "🇺🇸 US",
  "🇯🇵 JP",
  "🇨🇳 CN",
  "🇪🇺 EU",
  "🇦🇪 AE",
  "🇸🇬 SG",
] as const;

export function BrandImpactHero({
  setupCtaLabel,
  fullScreen = false,
}: {
  setupCtaLabel: string;
  fullScreen?: boolean;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [viewportH, setViewportH] = useState(1000);

  useEffect(() => {
    if (!fullScreen) return;
    const handle = () => {
      setScrollY(window.scrollY);
      setViewportH(window.innerHeight || 1000);
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [fullScreen]);

  const revealStart = viewportH * 0.34;
  const revealRange = viewportH * 0.32;
  const revealProgress = Math.max(0, Math.min(1, (scrollY - revealStart) / Math.max(1, revealRange)));
  const heroProgress = fullScreen ? Math.max(0, Math.min(1, scrollY / Math.max(1, viewportH * 0.42))) : 1;
  const subCopyProgress = fullScreen ? Math.max(0, Math.min(1, (heroProgress - 0.14) / 0.22)) : 1;
  const coverageProgress = fullScreen ? Math.max(0, Math.min(1, (heroProgress - 0.34) / 0.2)) : 1;
  const trustCopyProgress = fullScreen ? Math.max(0, Math.min(1, (heroProgress - 0.5) / 0.18)) : 1;
  const ctaProgress = fullScreen ? Math.max(0, Math.min(1, (heroProgress - 0.6) / 0.18)) : 1;

  return (
    <section
      className={cn(
        "w-full",
        fullScreen && "relative left-1/2 right-1/2 -mx-[50vw] w-screen",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 px-5 py-10 text-white sm:px-10 sm:py-14",
            fullScreen && "min-h-dvh rounded-none border-0 px-6 pt-24 pb-12 sm:px-12 sm:pt-28",
        )}
      >
        <video
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover blur-[1.6px] brightness-[0.42] saturate-[1.15] transition-transform duration-300"
          style={fullScreen ? { transform: `translate3d(0, ${Math.min(scrollY * 0.12, 36)}px, 0) scale(1.08)` } : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {heroVideoSources.map((src) => (
            <source key={src} src={src} type="video/mp4" />
          ))}
        </video>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(236,72,153,0.22),transparent_42%),radial-gradient(circle_at_82%_10%,rgba(56,189,248,0.22),transparent_38%),linear-gradient(to_bottom,rgba(9,9,11,0.2),rgba(9,9,11,0.86))]"
          style={fullScreen ? { opacity: 1 - Math.min(scrollY / Math.max(1, viewportH * 1.4), 0.24) } : undefined}
        />
        <div className="absolute -right-28 top-4 hidden h-72 w-72 rounded-full border border-white/15 bg-white/5 sm:block brand-hero-globe" aria-hidden />
        <div className="absolute -left-18 bottom-4 hidden h-40 w-40 rounded-full border border-white/10 bg-fuchsia-300/10 blur-2xl sm:block" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-zinc-950/75 to-transparent" aria-hidden />

        <div className={cn("relative mx-auto max-w-6xl text-center", fullScreen && "flex min-h-[calc(100svh-9rem)] flex-col items-center justify-center")}>
          <h1
            className="mx-auto mt-3 max-w-6xl text-balance break-keep font-heading text-6xl font-black leading-[1.2] tracking-[-0.045em] text-white [text-shadow:0_14px_36px_rgba(0,0,0,0.74)] animate-in fade-in-0 slide-in-from-bottom-2 duration-700 sm:mt-4 sm:text-8xl lg:text-[7rem]"
            style={fullScreen ? { transform: `scale(${1.09 - heroProgress * 0.1})`, transformOrigin: "center center" } : undefined}
          >
            <span className="block">전 세계 어디든,</span>
            <span className="mt-1 block bg-linear-to-r from-white via-fuchsia-100 to-sky-100 bg-clip-text text-transparent">
              인플루언서를 보내드립니다.
            </span>
          </h1>
          <p
            className="mx-auto mt-8 max-w-4xl text-balance text-lg leading-[1.82] text-zinc-100/92 [text-shadow:0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-500 sm:mt-9 sm:text-xl lg:text-2xl"
            style={
              fullScreen
                ? {
                    opacity: subCopyProgress,
                    transform: `translateY(${18 - subCopyProgress * 18}px)`,
                  }
                : undefined
            }
          >
            <span className="block">
              국가별 섭외부터 현장 방문, 업로드, 성과 보고까지
              <br className="sm:hidden" />
              K-LINK 운영팀이 직접 끝까지 실행합니다.
            </span>
            <span className="mt-2.5 block text-zinc-200/90 sm:mt-3">
              캠페인 세팅 즉시 착수 가능한 구조로,
              <br className="sm:hidden" />
              해외 타깃 캠페인을 가장 빠르고 안정적으로 확장합니다.
            </span>
          </p>

          <p
            className="mx-auto mt-7 inline-flex max-w-5xl flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-base font-semibold tracking-[0.03em] text-fuchsia-50 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-500 sm:mt-8 sm:text-lg"
            style={
              fullScreen
                ? {
                    opacity: coverageProgress,
                    transform: `translateY(${16 - coverageProgress * 16}px)`,
                  }
                : undefined
            }
          >
            <span className="block sm:hidden">
              운영 권역: {coverageRegions.slice(0, 4).join(" · ")}
              <br />
              {coverageRegions.slice(4).join(" · ")}
            </span>
            <span className="hidden sm:block">운영 권역: {coverageRegions.join(" · ")}</span>
          </p>

          <div
            className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-3 transition-all duration-500 sm:flex-row"
            style={
              fullScreen
                ? {
                    opacity: ctaProgress,
                    transform: `translateY(${20 - ctaProgress * 20}px)`,
                    pointerEvents: ctaProgress < 0.95 ? "none" : "auto",
                  }
                : undefined
            }
          >
            <Link
              href="/campaign/setup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group border-white/15 bg-[#ff2f9b] text-white shadow-[0_12px_40px_-12px_rgba(236,72,153,0.65)] hover:bg-[#e61c8d] sm:min-h-13 sm:flex-1",
              )}
            >
              {setupCtaLabel}
              <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/consulting"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/55 bg-white/14 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] hover:border-white/75 hover:bg-white/22 sm:min-h-13 sm:flex-1",
              )}
            >
              캠페인 상담받기
            </Link>
          </div>
          <p
            className="mx-auto mt-6 max-w-2xl text-sm leading-[1.75] text-zinc-300/95 transition-all duration-500 sm:mt-7"
            style={
              fullScreen
                ? {
                    opacity: trustCopyProgress,
                    transform: `translateY(${16 - trustCopyProgress * 16}px)`,
                  }
                : undefined
            }
          >
            견적 산출 기준(인원/국가/채널)은 세팅 화면에서 즉시 공개됩니다.
            <br className="sm:hidden" />
            결제 전 단계에서 총비용을 투명하게 확인할 수 있습니다.
          </p>
          {fullScreen ? (
            <p
              className="mt-7 text-[11px] font-medium tracking-[0.14em] text-zinc-300/85 transition-opacity duration-300"
              style={{ opacity: Math.max(0, 1 - heroProgress * 1.3) }}
            >
              SCROLL TO EXPLORE
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
