"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

/** 루트(/) 브랜드 랜딩 풀스크린 히어로 핀·슬라이드가 끝난 뒤에만 띄움. 값은 BrandImpactHero FULLSCREEN_SCROLL_EXTRA_MIN_VH와 맞출 것. */
const FOR_BRANDS_FLOAT_REVEAL_VH_MULT = 2.35;

export function BrandFloatingSetupCta({ label }: { label: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      const threshold =
        pathname === "/" || pathname === "/for-brands" ? h * FOR_BRANDS_FLOAT_REVEAL_VH_MULT : h * 0.78;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed bottom-3 left-1/2 z-30 w-[calc(100%-2rem)] max-w-xs transition-all duration-300 sm:bottom-4 sm:max-w-sm",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        transform: visible ? "translate(-50%, 0)" : "translate(-50%, 1rem)",
      }}
    >
      <Link
        href="/campaign/setup"
        className={cn(
          buttonVariants({ size: "default" }),
          "flex h-10 w-full items-center justify-center gap-1.5 bg-[#ff2f9b] px-3 text-sm text-white shadow-md hover:bg-[#e61c8d] sm:h-11",
        )}
      >
        <span className="text-center text-xs font-semibold leading-snug sm:text-sm">{label}</span>
        <ArrowRight className="size-3.5 shrink-0 sm:size-4" />
      </Link>
    </div>
  );
}
