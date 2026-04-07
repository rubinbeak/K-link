"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const centerMenu = [
  { label: "서비스 설명", href: "/services/visit-content", match: "/services/visit-content" },
  { label: "캠페인 세팅", href: "/campaign/setup", match: "/campaign/setup" },
  { label: "캠페인 상담하기", href: "/consulting", match: "/consulting" },
] as const;

function isActivePath(pathname: string, match: string) {
  return pathname === match || pathname.startsWith(`${match}/`);
}

function homeForRole(role?: string) {
  switch (role) {
    case "BRAND":
      return "/brand";
    case "INFLUENCER":
      return "/influencer/my";
    case "ADMIN":
      return "/admin";
    default:
      return "/my";
  }
}

export function TopNavigationBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [introPassed, setIntroPassed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (pathname === "/for-brands") {
        setIntroPassed(y > window.innerHeight * 0.55);
      } else {
        setIntroPassed(true);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isAuthActive = useMemo(() => pathname === "/login" || pathname.startsWith("/signup"), [pathname]);
  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role;
  const myPageHref = homeForRole(userRole);
  const displayName = session?.user?.name || session?.user?.email || "내 계정";

  const hideForHeroIntro = pathname === "/for-brands" && !introPassed;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 overflow-hidden border-b border-zinc-200/70 bg-white/80 transition-all duration-300 backdrop-blur-md",
        scrolled ? "bg-white/92 shadow-[0_8px_26px_-18px_rgba(15,23,42,0.35)]" : "bg-white/78",
        hideForHeroIntro
          ? "max-h-0 -translate-y-full border-transparent bg-transparent opacity-0 pointer-events-none shadow-none"
          : "max-h-24 translate-y-0 opacity-100",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/for-brands" className="shrink-0 text-base font-semibold tracking-tight sm:text-lg">
          <span className="text-primary">K-LINK</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="메인 퍼널 메뉴">
          {centerMenu.map((item) => {
            const active = isActivePath(pathname, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition",
                  active ? "text-primary" : "text-zinc-600 hover:text-zinc-900",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-2 -bottom-[3px] h-0.5 rounded-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[180px] truncate text-xs text-zinc-600">{displayName}</span>
              <Link
                href={myPageHref}
                className="rounded-full border border-primary/45 bg-primary/8 px-3.5 py-1.5 text-sm font-semibold text-primary transition hover:bg-primary/12"
              >
                내 마이페이지
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/for-brands" })}
                className="rounded-full border border-zinc-300 bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                isAuthActive
                  ? "border-primary/45 bg-primary/8 text-primary"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",
              )}
            >
              로그인/회원가입
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-top-nav"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-top-nav" className="border-t border-zinc-200/70 bg-white/95 px-4 pb-4 pt-3 backdrop-blur md:hidden">
          <nav className="space-y-1" aria-label="모바일 퍼널 메뉴">
            {centerMenu.map((item) => {
              const active = isActivePath(pathname, item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    active ? "bg-primary/8 text-primary" : "text-zinc-700 hover:bg-zinc-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <Link
                  href={myPageHref}
                  className="mt-2 block rounded-lg border border-primary/45 bg-primary/8 px-3 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/12"
                >
                  내 마이페이지
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/for-brands" })}
                  className="mt-2 block w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-left text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={cn(
                  "mt-2 block rounded-lg border px-3 py-2.5 text-sm font-semibold transition",
                  isAuthActive ? "border-primary/45 bg-primary/8 text-primary" : "border-zinc-300 text-zinc-700 hover:bg-zinc-100",
                )}
              >
                로그인/회원가입
              </Link>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
