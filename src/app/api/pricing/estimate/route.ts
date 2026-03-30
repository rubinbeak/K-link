import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { estimatePricing, FOLLOWER_TIER_VALUES } from "@/lib/visit-campaign";

const schema = z.object({
  headcount: z.number().int().min(1),
  followerTier: z.enum(FOLLOWER_TIER_VALUES),
});

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json(estimatePricing(parsed.data));
}
