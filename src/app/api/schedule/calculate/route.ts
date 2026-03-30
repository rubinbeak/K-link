import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/api-auth";
import { calculateSchedule } from "@/lib/visit-campaign";

const schema = z.object({
  visitStartDate: z.coerce.date(),
});

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const result = calculateSchedule(parsed.data.visitStartDate);
  return NextResponse.json({
    guidelineConfirmBy: result.guidelineConfirmBy,
    influencerListDeliveryDate: result.influencerListDeliveryDate,
    visitStartDate: result.visitStartDate,
    uploadDueDate: result.uploadDueDate,
    reportDueDate: result.reportDueDate,
    rules: {
      listDelivery: result.rule,
    },
  });
}
