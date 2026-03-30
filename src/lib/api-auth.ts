import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}

export async function requireRole(role: "BRAND" | "INFLUENCER" | "ADMIN") {
  const result = await requireAuth();
  if (!result.ok) return result;
  if (result.session.user.role !== role) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}
