"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function BrandFloatingSetupCta({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.78;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-30 w-[calc(100%-1.25rem)] max-w-lg -translate-x-1/2 transition-all duration-300 sm:bottom-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
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
