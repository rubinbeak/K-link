import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { draftPayloadSchema } from "@/lib/visit-campaign";

export async function GET(_request: Request, { params }: { params: Promise<{ draftId: string }> }) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const { draftId } = await params;
  const draft = await prisma.campaignDraft.findUnique({ where: { id: draftId } });
  if (!draft || draft.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    draftId: draft.id,
    currentStep: draft.currentStep,
    data: draft.data,
    lastSavedAt: draft.lastSavedAt,
    autosaveVersion: draft.autosaveVersion,
    isFinalized: draft.isFinalized,
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ draftId: string }> }) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const { draftId } = await params;
  const existing = await prisma.campaignDraft.findUnique({ where: { id: draftId } });
  if (!existing || existing.brandId !== authResult.session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.isFinalized) {
    return NextResponse.json({ error: "Already finalized" }, { status: 409 });
  }

  const body = await request.json().catch(() => null);
  const parsed = draftPayloadSchema.partial().safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const merged = {
    ...(existing.data as object),
    ...(parsed.data.data ?? {}),
  };

  const draft = await prisma.campaignDraft.update({
    where: { id: draftId },
    data: {
      name: parsed.data.name ?? existing.name,
      currentStep: parsed.data.currentStep ?? existing.currentStep,
      data: merged,
      autosaveVersion: { increment: 1 },
      lastSavedAt: new Date(),
    },
  });

  return NextResponse.json({
    draftId: draft.id,
    savedAt: draft.lastSavedAt,
    autosaveVersion: draft.autosaveVersion,
    autosaved: true,
  });
}
