import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { campaignDraftUpsertSchema } from "@/lib/visit-campaign";
import { funnelStep1ToBrandContact, persistBrandContactForUser } from "@/lib/brand-profile";

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = campaignDraftUpsertSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const dataJson = (parsed.data.data ?? {}) as Prisma.InputJsonValue;
  const draft = await prisma.campaignDraft.create({
    data: {
      brandId: authResult.session.user.id,
      name: parsed.data.name,
      currentStep: parsed.data.currentStep ?? 1,
      data: dataJson,
      autosaveVersion: 1,
    },
  });

  const merged = parsed.data.data as Record<string, unknown> | undefined;
  const contact = merged?.step1 ? funnelStep1ToBrandContact(merged.step1) : null;
  if (contact) {
    await persistBrandContactForUser(prisma, authResult.session.user.id, contact);
  }

  return NextResponse.json(
    { draftId: draft.id, status: "DRAFT", savedAt: draft.lastSavedAt, autosaveVersion: draft.autosaveVersion },
    { status: 201 },
  );
}
