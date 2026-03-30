import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult.response;

  const { user } = authResult.session;
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role,
  });
}
