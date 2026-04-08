import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { campaignDraftUpsertSchema } from "@/lib/visit-campaign";

export async function POST(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = campaignDraftUpsertSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const draft = await prisma.campaignDraft.create({
    data: {
      brandId: authResult.session.user.id,
      name: parsed.data.name,
      currentStep: parsed.data.currentStep ?? 1,
      data: (parsed.data.data ?? {}) as Prisma.InputJsonValue,
      autosaveVersion: 1,
    },
  });

  return NextResponse.json(
    { draftId: draft.id, status: "DRAFT", savedAt: draft.lastSavedAt, autosaveVersion: draft.autosaveVersion },
    { status: 201 },
  );
}
