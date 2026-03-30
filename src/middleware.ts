import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

function homeForRole(role: string) {
  switch (role) {
    case "BRAND":
      return "/brand";
    case "INFLUENCER":
      return "/influencer/feed";
    case "ADMIN":
      return "/admin";
    default:
      return "/";
  }
}

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const path = req.nextUrl.pathname;

  if (path.startsWith("/brand")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "BRAND") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  if (path.startsWith("/influencer")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "INFLUENCER") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  if (path.startsWith("/admin")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  if (path.startsWith("/campaign/setup")) {
    if (!token?.role) return NextResponse.redirect(new URL("/login", req.url));
    if (token.role !== "BRAND") {
      return NextResponse.redirect(new URL(homeForRole(String(token.role)), req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/brand",
    "/brand/:path*",
    "/influencer",
    "/influencer/:path*",
    "/admin",
    "/admin/:path*",
    "/campaign/setup",
    "/campaign/setup/:path*",
  ],
};
