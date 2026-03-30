"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PlayCircle } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type CountryCode = "ALL" | "JP" | "US" | "CN" | "SEA" | "KR";

type CreatorsDiscoveryPanelProps = {
  filterTitle: string;
  allLabel: string;
  countryLabels: {
    JP: string;
    US: string;
    CN: string;
    SEA: string;
    KR: string;
  };
  shortformTitle: string;
  shortformSubtitle: string;
  watchLabel: string;
  campaignTitle: string;
  campaignSubtitle: string;
  applyLabel: string;
  rewardLabel: string;
  slotsLabel: string;
  deadlineLabel: string;
  viewsLabel: string;
  engagementLabel: string;
};

const countryOrder: CountryCode[] = ["ALL", "JP", "US", "CN", "SEA", "KR"];

const shortformRefs = [
  {
    id: "sf-1",
    country: "JP" as const,
    title: "Pop-up skincare first impression",
    platform: "TIKTOK" as const,
    viewCount: 1200000,
    engagementRate: 8.7,
    thumbnail:
      "https://images.pexels.com/photos/3373746/pexels-photo-3373746.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://www.pexels.com/video/woman-holding-cosmetic-products-3762888/",
  },
  {
    id: "sf-2",
    country: "US" as const,
    title: "K-beauty store walkthrough reel",
    platform: "REELS" as const,
    viewCount: 860000,
    engagementRate: 7.9,
    thumbnail:
      "https://images.pexels.com/photos/3738347/pexels-photo-3738347.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://www.pexels.com/video/woman-applying-makeup-3762871/",
  },
  {
    id: "sf-3",
    country: "CN" as const,
    title: "Hydration challenge short",
    platform: "TIKTOK" as const,
    viewCount: 980000,
    engagementRate: 8.1,
    thumbnail:
      "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://www.pexels.com/video/woman-showing-skincare-products-3762874/",
  },
  {
    id: "sf-4",
    country: "SEA" as const,
    title: "Night routine in 20 seconds",
    platform: "SHORTS" as const,
    viewCount: 730000,
    engagementRate: 6.8,
    thumbnail:
      "https://images.pexels.com/photos/1619488/pexels-photo-1619488.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://www.pexels.com/video/a-woman-applying-a-cosmetic-product-3738336/",
  },
  {
    id: "sf-5",
    country: "KR" as const,
    title: "Store visit + product pickup vlog",
    platform: "SHORTS" as const,
    viewCount: 640000,
    engagementRate: 6.2,
    thumbnail:
      "https://images.pexels.com/photos/5938595/pexels-photo-5938595.jpeg?auto=compress&cs=tinysrgb&w=1200",
    url: "https://www.pexels.com/video/woman-testing-skincare-product-5938588/",
  },
];

const campaignSamples = [
  { id: "cp-1", country: "JP" as const, title: "Tokyo flagship store visit", reward: "$380", slots: 8, deadline: "D-5" },
  { id: "cp-2", country: "US" as const, title: "LA clean beauty challenge", reward: "$520", slots: 5, deadline: "D-3" },
  { id: "cp-3", country: "CN" as const, title: "Shanghai pop-up review", reward: "$470", slots: 7, deadline: "D-6" },
  { id: "cp-4", country: "SEA" as const, title: "Bangkok clinic experience", reward: "$410", slots: 6, deadline: "D-4" },
  { id: "cp-5", country: "KR" as const, title: "Seoul beauty road vlog", reward: "$350", slots: 10, deadline: "D-7" },
  { id: "cp-6", country: "JP" as const, title: "Osaka launch day shortform", reward: "$430", slots: 4, deadline: "D-2" },
];

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function AnimatedCounter({ target, type }: { target: number; type: "views" | "rate" }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const started = performance.now();
    const duration = 850;

    const tick = (now: number) => {
      const progress = Math.min((now - started) / duration, 1);
      setValue(target * progress);
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  if (type === "rate") return <>{value.toFixed(1)}%</>;
  return <>{compactFormatter.format(Math.round(value))}</>;
}

function PlatformBadge({ platform }: { platform: "TIKTOK" | "REELS" | "SHORTS" }) {
  if (platform === "TIKTOK") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-black/75 px-2 py-1 text-[11px] font-medium text-white">
        <SiTiktok className="size-3" />
        TikTok
      </span>
    );
  }
  if (platform === "REELS") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-linear-to-r from-fuchsia-600/85 to-pink-500/85 px-2 py-1 text-[11px] font-medium text-white">
        <SiInstagram className="size-3" />
        Reels
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-red-600/85 px-2 py-1 text-[11px] font-medium text-white">
      <SiYoutube className="size-3.5" />
      Shorts
    </span>
  );
}

export function CreatorsDiscoveryPanel(props: CreatorsDiscoveryPanelProps) {
  const [country, setCountry] = useState<CountryCode>("ALL");

  const countryLabels: Record<CountryCode, string> = {
    ALL: props.allLabel,
    JP: props.countryLabels.JP,
    US: props.countryLabels.US,
    CN: props.countryLabels.CN,
    SEA: props.countryLabels.SEA,
    KR: props.countryLabels.KR,
  };

  const visibleShortforms = useMemo(
    () => (country === "ALL" ? shortformRefs : shortformRefs.filter((item) => item.country === country)),
    [country],
  );
  const visibleCampaigns = useMemo(
    () => (country === "ALL" ? campaignSamples : campaignSamples.filter((item) => item.country === country)),
    [country],
  );

  return (
    <section className="mt-16 space-y-8">
      <div className="text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">{props.filterTitle}</h2>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {countryOrder.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setCountry(code)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                country === code
                  ? "border-primary/40 bg-primary/12 text-primary shadow-sm shadow-pink-100/60"
                  : "border-border/70 bg-card/70 text-muted-foreground hover:border-primary/25 hover:text-foreground",
              )}
            >
              {countryLabels[code]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-xl shadow-pink-100/45 backdrop-blur-md">
          <h3 className="font-heading text-xl font-semibold">{props.shortformTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{props.shortformSubtitle}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {visibleShortforms.slice(0, 4).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-xl border border-white/75"
              >
                <div className="absolute left-2 top-2 z-20">
                  <PlatformBadge platform={item.platform} />
                </div>
                <div
                  className="h-36 bg-cover bg-center transition duration-300 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url("${item.thumbnail}")` }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <div className="flex items-center gap-3 text-[11px] opacity-95">
                    <p>
                      {props.viewsLabel}: <span className="font-semibold"><AnimatedCounter target={item.viewCount} type="views" /></span>
                    </p>
                    <p>
                      {props.engagementLabel}:{" "}
                      <span className="font-semibold"><AnimatedCounter target={item.engagementRate} type="rate" /></span>
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-tight">{item.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-pink-100">
                    <PlayCircle className="size-3.5" />
                    {props.watchLabel}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-xl shadow-pink-100/45 backdrop-blur-md">
          <h3 className="font-heading text-xl font-semibold">{props.campaignTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{props.campaignSubtitle}</p>
          <div className="mt-5 space-y-3">
            {visibleCampaigns.slice(0, 5).map((item) => (
              <div key={item.id} className="rounded-xl border border-border/70 bg-background/70 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{countryLabels[item.country]}</p>
                  </div>
                  <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
                    {item.deadline}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <p>{props.rewardLabel}: <span className="font-medium text-foreground">{item.reward}</span></p>
                  <p>{props.slotsLabel}: <span className="font-medium text-foreground">{item.slots}</span></p>
                </div>
                <div className="mt-3">
                  <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "w-full")}>
                    {props.applyLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">{props.deadlineLabel}: D-2 ~ D-7</p>
        </div>
      </div>
    </section>
  );
}
