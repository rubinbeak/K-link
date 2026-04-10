import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const BRAND_ONLY_PUBLIC_LANDING = "/";
const BRAND_AUTH_REQUIRED_PREFIXES = ["/campaign/setup", "/consulting"] as const;

/** Auth.js uses `__Secure-` session cookies when the sign-in URL is HTTPS; getToken must use the same flag. */
function isHttps(req: NextRequest): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() === "https";
  }
  return req.nextUrl.protocol === "https:";
}

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
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = await getToken({
    req,
    secret,
    secureCookie: isHttps(req),
  });
  const path = req.nextUrl.pathname;
  const fullPath = `${path}${req.nextUrl.search}`;
  const role = token?.role;

  const requiresBrandAuth = BRAND_AUTH_REQUIRED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  if (requiresBrandAuth && !role) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(fullPath)}`, req.url));
  }
  if (requiresBrandAuth && role && role !== "BRAND") {
    return NextResponse.redirect(new URL(homeForRole(String(role)), req.url));
  }

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
    "/campaign/setup",
    "/campaign/setup/:path*",
    "/consulting",
    "/consulting/:path*",
    "/creators",
    "/creators/:path*",
    "/influencer",
    "/influencer/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
