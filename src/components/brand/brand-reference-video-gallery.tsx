"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ReferenceVideo = {
  id: string;
  platform: "tiktok" | "instagram" | "xiaohongshu" | "mp4";
  sourceUrl: string;
  title: string;
  targetCountry: string;
  flagCodes: readonly string[];
  summary: string;
};

export function BrandReferenceVideoGallery({ videos }: { videos: readonly ReferenceVideo[] }) {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const localVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  function startPlaying(video: ReferenceVideo) {
    if (playingVideoId && playingVideoId !== video.id) {
      const prev = localVideoRefs.current[playingVideoId];
      if (prev) {
        prev.pause();
        prev.currentTime = 0;
      }
    }

    setPlayingVideoId(video.id);
    if (video.platform === "mp4") {
      const next = localVideoRefs.current[video.id];
      if (next) {
        void next.play().catch(() => undefined);
      }
    }
  }

  function stopPlaying(video: ReferenceVideo) {
    if (video.platform === "mp4") {
      const current = localVideoRefs.current[video.id];
      if (current) {
        current.pause();
        current.currentTime = 0;
      }
    }
    setPlayingVideoId(null);
  }

  function playerSrc(video: ReferenceVideo, autoplay: boolean) {
    if (video.platform === "tiktok") {
      const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        controls: "1",
        description: "0",
        music_info: "0",
        rel: "0",
      });
      return `https://www.tiktok.com/player/v1/${video.id}?${params.toString()}`;
    }
    if (video.platform === "instagram") {
      return `https://www.instagram.com/reel/${video.id}/embed`;
    }
    if (video.platform === "mp4") {
      return video.sourceUrl;
    }
    return video.sourceUrl;
  }

  return (
    <>
      <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
        {videos.map((item, index) => (
          <article key={item.id} className="group text-left">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-950 shadow-[0_16px_44px_-16px_rgba(17,24,39,0.35)] ring-1 ring-black/8 transition group-hover:-translate-y-0.5 group-hover:ring-primary/30">
              <div className="aspect-9/16 overflow-hidden">
                {item.platform === "mp4" ? (
                  <video
                    ref={(node) => {
                      localVideoRefs.current[item.id] = node;
                    }}
                    src={playerSrc(item, playingVideoId === item.id)}
                    className={cn(
                      "h-full w-full object-cover",
                      playingVideoId === item.id ? "" : "pointer-events-none",
                    )}
                    controls={playingVideoId === item.id}
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <iframe
                    src={playerSrc(item, playingVideoId === item.id)}
                    title={`레퍼런스 썸네일 ${index + 1}`}
                    className={cn(
                      "h-full w-full border-0",
                      playingVideoId === item.id ? "" : "pointer-events-none",
                    )}
                    loading="lazy"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  />
                )}
              </div>
              {playingVideoId === item.id ? (
                <>
                  <span className="absolute left-2 top-2 z-20 rounded-full border border-emerald-300/55 bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-emerald-100">
                    NOW PLAYING
                  </span>
                  <button
                    type="button"
                    onClick={() => stopPlaying(item)}
                    className="absolute right-2 top-2 z-20 inline-flex size-8 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/75"
                    aria-label="영상 닫기"
                  >
                    <X className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,114,182,0.06)_0%,rgba(24,24,27,0.14)_55%,rgba(56,189,248,0.06)_100%)]" aria-hidden />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                    <span className="inline-flex size-14 items-center justify-center rounded-full border border-white/70 bg-black/55 text-white shadow-lg">
                      <Play className="ml-0.5 size-6" />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => startPlaying(item)}
                    className="absolute inset-0 z-10"
                    aria-label={`레퍼런스 영상 ${index + 1} 재생`}
                  />
                </>
              )}
            </div>
            <div className="mt-3.5 text-center">
              <p className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold leading-snug text-zinc-900">
                <span className="inline-flex items-center gap-1">
                  {item.flagCodes.map((code) => (
                    <Image
                      key={`${item.id}-${code}`}
                      src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
                      alt={`${code.toUpperCase()} 국기`}
                      width={24}
                      height={18}
                      className="inline-block h-3.5 w-[1.1rem] rounded-[2px] border border-zinc-200/90 align-middle shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                    />
                  ))}
                </span>
                <span>{item.title}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
