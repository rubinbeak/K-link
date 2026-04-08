"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

/** /for-brands 풀스크린 히어로 핀·슬라이드가 끝난 뒤에만 띄움. 값은 BrandImpactHero FULLSCREEN_SCROLL_EXTRA_MIN_VH와 맞출 것. */
const FOR_BRANDS_FLOAT_REVEAL_VH_MULT = 2.35;

export function BrandFloatingSetupCta({ label }: { label: string }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = window.innerHeight || 1;
      const threshold =
        pathname === "/for-brands" ? h * FOR_BRANDS_FLOAT_REVEAL_VH_MULT : h * 0.78;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-30 w-[calc(100%-1.25rem)] max-w-lg transition-all duration-300 sm:bottom-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      style={{
        transform: visible ? "translate(-50%, 0)" : "translate(-50%, 1rem)",
      }}
    >
      <Link
        href="/campaign/setup"
        className={cn(
          buttonVariants({ size: "lg" }),
          "flex w-full items-center justify-center gap-2 bg-[#ff2f9b] px-4 text-white shadow-lg hover:bg-[#e61c8d]",
        )}
      >
        <span className="text-center text-sm font-semibold leading-snug">{label}</span>
        <ArrowRight className="size-4 shrink-0" />
      </Link>
    </div>
  );
}
