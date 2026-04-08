"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const heroVideoSources = [
  "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4",
  "https://videos.pexels.com/video-files/3129595/3129595-hd_1920_1080_24fps.mp4",
] as const;

/** flagcdn.com ISO 3166-1 alpha-2 (eu = 유럽연합 기) */
const coverageRegions = [
  { iso: "kr", label: "KR" },
  { iso: "us", label: "US" },
  { iso: "jp", label: "JP" },
  { iso: "cn", label: "CN" },
  { iso: "eu", label: "EU" },
  { iso: "ae", label: "AE" },
  { iso: "sg", label: "SG" },
] as const;

/**
 * 1뷰포트 + 아래 값만큼 스크롤해야 핀이 풀립니다.
 * 단계 스크롤 합(≈0.54×뷰포트) + 위로 밀어 올리는 구간(최대 1뷰포트)보다 커야 합니다.
 */
const FULLSCREEN_SCROLL_EXTRA_MIN_VH = 96;

export function BrandImpactHero({ fullScreen = false }: { fullScreen?: boolean }) {
  const [scrollY, setScrollY] = useState(0);
  const [viewportH, setViewportH] = useState(1000);
  const [pinReleaseY, setPinReleaseY] = useState<number | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);

  const measurePinRelease = useCallback(() => {
    if (!fullScreen || typeof window === "undefined") return;
    const el = scrollTrackRef.current;
    if (!el) return;
    const docTop = window.scrollY + el.getBoundingClientRect().top;
    const release = docTop + el.offsetHeight - window.innerHeight;
    setPinReleaseY(Math.max(0, release));
  }, [fullScreen]);

  useEffect(() => {
    if (!fullScreen) return;
    const handle = () => {
      setScrollY(window.scrollY);
      setViewportH(window.innerHeight || 1000);
      measurePinRelease();
    };
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [fullScreen, measurePinRelease]);

  useLayoutEffect(() => {
    if (!fullScreen) return;
    const el = scrollTrackRef.current;
    if (!el) return;
    measurePinRelease();
    const ro = new ResizeObserver(() => measurePinRelease());
    ro.observe(el);
    return () => ro.disconnect();
  }, [fullScreen, measurePinRelease]);

  /** 핀 해제 후: 투명도로 지우지 않고 그대로 위로 밀어 올려, 흰 빈 화면이 끼지 않게 함 */
  const heroSlideUpPx =
    fullScreen && pinReleaseY !== null
      ? Math.min(Math.max(0, scrollY - pinReleaseY), viewportH)
      : 0;

  const v = Math.max(1, viewportH);
  /** 단계별 스크롤 거리(px). 합은 스크롤 트랙 여유(96vh)보다 짧아야 합니다. */
  const phaseLine1 = v * 0.11;
  const phaseLine2 = v * 0.11;
  const phaseSubCopy = v * 0.15;
  const phaseOvals = v * 0.17;
  const t1 = phaseLine1;
  const t2 = t1 + phaseLine2;
  const t3 = t2 + phaseSubCopy;

  const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

  const heroProgress = fullScreen ? clamp01(scrollY / phaseLine1) : 1;
  const headlineSecondProgress = fullScreen ? clamp01((scrollY - t1) / phaseLine2) : 1;
  const subCopyProgress = fullScreen ? clamp01((scrollY - t2) / phaseSubCopy) : 1;
  /** 운영 권역 타원 + 국기 — 완료 후 이어지는 스크롤로 핀 해제·다음 섹션 */
  const ovalProgress = fullScreen ? clamp01((scrollY - t3) / phaseOvals) : 1;

  const heroShellFullScroll =
    "relative mx-auto max-w-6xl text-center flex w-full flex-col items-center justify-start gap-4 px-1 py-5 sm:gap-5 sm:py-6 md:gap-6";

  const heroBody = (
    <>
      <h1
        className={cn(
          "mx-auto flex max-w-6xl shrink-0 flex-col items-center gap-0 font-heading",
          !fullScreen && "animate-in fade-in-0 slide-in-from-bottom-2 duration-700",
        )}
        style={
          fullScreen
            ? {
                transform: `scale(${1.03 - heroProgress * 0.05})`,
                transformOrigin: "center top",
              }
            : undefined
        }
      >
        <span className="block max-w-6xl text-balance break-keep text-7xl font-black leading-[1.15] tracking-[-0.045em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55),0_12px_40px_rgba(0,0,0,0.35)] sm:text-8xl sm:leading-[1.12] lg:text-[8rem] lg:leading-[1.08]">
          전 세계 어디든
        </span>
        <span
          className={cn(
            "block max-w-6xl origin-top text-balance break-keep text-4xl font-black leading-tight tracking-[-0.04em] text-white transition-[opacity,transform,margin,max-height] duration-500 ease-out sm:whitespace-nowrap sm:text-5xl lg:mt-2 lg:text-6xl",
            "[text-shadow:0_1px_3px_rgba(0,0,0,0.5),0_10px_32px_rgba(0,0,0,0.3)]",
          )}
          style={
            fullScreen
              ? {
                  opacity: headlineSecondProgress,
                  transform: `translateY(${(1 - headlineSecondProgress) * 22}px) scale(${0.97 + headlineSecondProgress * 0.03})`,
                  marginTop: headlineSecondProgress > 0.02 ? "clamp(1.5rem, 5vw, 2.75rem)" : 0,
                  maxHeight: headlineSecondProgress > 0.02 ? 240 : 0,
                  overflow: "hidden",
                  pointerEvents: headlineSecondProgress > 0.5 ? "auto" : "none",
                }
              : {
                  marginTop: "clamp(1.5rem, 5vw, 2.75rem)",
                }
          }
          aria-hidden={fullScreen && headlineSecondProgress < 0.02}
        >
          인플루언서를 보내드립니다
        </span>
      </h1>
      <p
        className="mx-auto max-w-4xl shrink-0 text-balance text-lg leading-[1.82] text-zinc-100/92 [text-shadow:0_4px_20px_rgba(0,0,0,0.6)] transition-[opacity,transform,margin,max-height] duration-500 ease-out sm:text-xl lg:text-2xl"
        style={
          fullScreen
            ? {
                opacity: subCopyProgress,
                transform: `translateY(${12 - subCopyProgress * 12}px)`,
                marginTop: subCopyProgress > 0.02 ? "clamp(1rem, 3vw, 1.5rem)" : 0,
                maxHeight: subCopyProgress > 0.02 ? 360 : 0,
                overflow: "hidden",
                pointerEvents: subCopyProgress > 0.5 ? "auto" : "none",
              }
            : { marginTop: "clamp(2rem, 5vw, 2.5rem)" }
        }
        aria-hidden={fullScreen && subCopyProgress < 0.02}
      >
        <span className="block font-semibold text-white/95">섭외부터 성과 보고까지 올인원</span>
        <span className="mt-2.5 block text-zinc-200/95 sm:mt-3">K-LINK가 직접 뛰고, 결과로 증명합니다.</span>
      </p>

      <div
        className="relative mx-auto w-full max-w-5xl shrink-0 transition-[opacity,transform,margin,max-height] duration-500 ease-out"
        style={
          fullScreen
            ? {
                opacity: ovalProgress,
                transform: `translateY(${14 - ovalProgress * 14}px)`,
                marginTop: ovalProgress > 0.02 ? "clamp(0.5rem, 2vw, 1rem)" : 0,
                maxHeight: ovalProgress > 0.02 ? "none" : 0,
                overflow: ovalProgress > 0.02 ? "visible" : "hidden",
                pointerEvents: ovalProgress > 0.5 ? "auto" : "none",
              }
            : { marginTop: "clamp(1.75rem, 4vw, 2rem)" }
        }
        aria-hidden={fullScreen && ovalProgress < 0.02}
      >
        <p className="mb-3 text-center text-xs font-semibold tracking-[0.14em] text-white/80 sm:mb-4 sm:text-sm">
          운영 권역
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 md:gap-3.5">
          {coverageRegions.map((region, index) => (
            <li
              key={region.iso}
              className="inline-flex origin-center transition-[opacity,transform] duration-500 ease-out"
              style={
                fullScreen
                  ? {
                      opacity: clamp01((ovalProgress * coverageRegions.length - index) / 1.15),
                      transform: `scale(${0.92 + 0.08 * clamp01((ovalProgress * coverageRegions.length - index * 0.65) / coverageRegions.length)})`,
                    }
                  : undefined
              }
            >
              <span className="inline-flex min-h-11 min-w-25 items-center justify-center gap-2 rounded-[999px] border border-white/40 bg-white/12 px-4 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_32px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:min-h-12 sm:min-w-28 sm:px-5">
                <img
                  src={`https://flagcdn.com/24x18/${region.iso}.png`}
                  alt={`${region.label} 국기`}
                  width={24}
                  height={18}
                  className="shrink-0 rounded-sm object-cover shadow-sm ring-1 ring-black/30"
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-sm font-semibold tracking-wide text-white sm:text-base">{region.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  const contentColumn = (
    <div className="relative mx-auto max-w-6xl text-center">
      {heroBody}
    </div>
  );

  const mediaLayers = (
    <>
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_40%_at_50%_18%,rgba(236,72,153,0.07),transparent_55%),radial-gradient(circle_at_82%_12%,rgba(56,189,248,0.14),transparent_40%),linear-gradient(to_bottom,rgba(9,9,11,0.18),rgba(9,9,11,0.62))]" />
      <div className="absolute -right-28 top-4 hidden h-72 w-72 rounded-full border border-white/15 bg-white/5 sm:block brand-hero-globe" aria-hidden />
      <div className="absolute -left-18 bottom-4 hidden h-40 w-40 rounded-full border border-white/10 bg-fuchsia-300/10 blur-2xl sm:block" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-zinc-950/25 to-transparent sm:h-16" aria-hidden />
    </>
  );

  return (
    <section className={cn("w-full", fullScreen && "relative isolate")}>
      {fullScreen ? (
        <>
          <div
            ref={scrollTrackRef}
            className="w-full bg-zinc-950"
            style={{ minHeight: `calc(100dvh + ${FULLSCREEN_SCROLL_EXTRA_MIN_VH}vh)` }}
            aria-hidden
          />
          <div
            className="fixed inset-0 z-40 flex h-dvh min-h-0 w-screen max-w-[100vw] flex-col overflow-hidden text-white"
            style={{
              transform: heroSlideUpPx > 0 ? `translateY(-${heroSlideUpPx}px)` : undefined,
              pointerEvents: heroSlideUpPx >= viewportH - 8 ? "none" : "auto",
            }}
            aria-hidden={heroSlideUpPx >= viewportH - 8}
          >
            <div className="absolute inset-0 overflow-hidden bg-zinc-950">{mediaLayers}</div>
            <div className="relative z-10 flex h-full min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden px-4 pt-24 pb-16 sm:px-8 sm:pt-28 sm:pb-20 md:px-10 md:pb-24 lg:px-12">
              <div className="flex min-h-0 flex-1 flex-col justify-start">
                <div className={heroShellFullScroll}>{heroBody}</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-950 px-5 py-10 text-white sm:px-10 sm:py-14">
          {mediaLayers}
          {contentColumn}
        </div>
      )}
    </section>
  );
}
