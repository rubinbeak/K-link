import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";

const bodySchema = z.object({
  brandName: z.string().min(1),
  managerProfile: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  eventName: z.string().optional().nullable(),
  eventLocation: z.string().min(1),
  eventStartDate: z.string().min(1),
  eventEndDate: z.string().min(1),
  campaignTypes: z.array(z.string()),
  goalValues: z.array(z.string()),
  goalLabels: z.array(z.string()),
  influencerScale: z.string().min(1),
  benefits: z.array(z.string()),
  additionalNotes: z.string().optional().nullable(),
});

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const jsonBody = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(jsonBody ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const p = parsed.data;
  const message = JSON.stringify({
    eventName: p.eventName,
    eventLocation: p.eventLocation,
    period: `${p.eventStartDate} ~ ${p.eventEndDate}`,
    campaignTypes: p.campaignTypes,
    goals: p.goalLabels.length ? p.goalLabels : p.goalValues,
    influencerScale: p.influencerScale,
    benefits: p.benefits,
    additionalNotes: p.additionalNotes,
  });

  await prisma.consultingLead.create({
    data: {
      userId: authResult.session.user.id,
      channel: "CAMPAIGN_CONSULT_FORM",
      name: p.managerProfile,
      company: p.brandName,
      email: p.email,
      phone: p.phone?.trim() || null,
      message,
      status: "RECEIVED",
    },
  });

  return NextResponse.json({ ok: true });
}
