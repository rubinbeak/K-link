import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const BRAND_ONLY_PUBLIC_LANDING = "/for-brands";

function homeForRole(role: string) {
  switch (role) {
    case "BRAND":
      return "/brand";
    case "INFLUENCER":
      return BRAND_ONLY_PUBLIC_LANDING;
    case "ADMIN":
      return "/admin";
    default:
      return BRAND_ONLY_PUBLIC_LANDING;
  }
}

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const path = req.nextUrl.pathname;

  /* 브랜드 전용 공개 단계: 크리에이터/인플루언서 공개 라우트 비노출 (추후 제거 가능) */
  if (path.startsWith("/creators") || path.startsWith("/influencer")) {
    return NextResponse.redirect(new URL(BRAND_ONLY_PUBLIC_LANDING, req.url));
  }

  if (path.startsWith("/brand")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "BRAND") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  if (path.startsWith("/admin")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/brand",
    "/brand/:path*",
    "/creators",
    "/creators/:path*",
    "/influencer",
    "/influencer/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
