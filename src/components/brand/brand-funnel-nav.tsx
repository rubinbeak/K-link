import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type SessionUser = {
  role?: "BRAND" | "INFLUENCER" | "ADMIN" | string;
} | null;

const funnelNavItems = [
  { step: "01", label: "서비스 설명", href: "/services/visit-content" },
  { step: "02", label: "캠페인 세팅", href: "/campaign/setup" },
  { step: "03", label: "캠페인 상담", href: "/consulting" },
  { step: "04", label: "로그인/회원가입", href: "/login" },
] as const;

function resolveMyPageHref(role?: NonNullable<SessionUser>["role"]) {
  if (role === "BRAND") return "/brand";
  if (role === "INFLUENCER") return "/influencer/my";
  if (role === "ADMIN") return "/admin";
  return "/my";
}

export function BrandFunnelNav({ sessionUser }: { sessionUser: SessionUser }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/90 backdrop-blur-xl supports-backdrop-filter:bg-white/70">
      <div className="brand-container py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/for-brands" className="text-lg font-semibold tracking-tight">
            <span className="text-primary">K-LINK</span>
            <span className="text-muted-foreground"> · 브랜드 퍼널</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/campaign/setup"
              className={cn(
                buttonVariants({ size: "sm" }),
                "group bg-[#ff2f9b] text-white shadow-sm shadow-fuchsia-500/25 hover:bg-[#e61c8d]",
              )}
            >
              캠페인 세팅하기
              <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" />
            </Link>
            {sessionUser ? (
              <Link href={resolveMyPageHref(sessionUser.role)} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-zinc-300")}>
                마이페이지
              </Link>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-zinc-300")}>
                로그인/회원가입
              </Link>
            )}
          </div>
        </div>
        <nav className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="브랜드 퍼널 내비게이션">
          {funnelNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-zinc-200/90 bg-white px-3 py-2.5 transition hover:border-primary/40 hover:bg-primary/4"
            >
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-500">{item.step}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-800">
                {item.label}
                <ArrowRight className="size-3.5 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </p>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
