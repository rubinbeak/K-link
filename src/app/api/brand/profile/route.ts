import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { brandContactToUserUpdateData, hasAnyBrandContactInput, userToBrandContactStep1 } from "@/lib/brand-profile";

const patchSchema = z.object({
  contactBrandName: z.string(),
  contactManagerProfile: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
});

export async function GET() {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const user = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    select: { brandName: true, name: true, email: true, brandContactEmail: true, contactPhoneE164: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ profile: userToBrandContactStep1(user) });
}

export async function PATCH(request: Request) {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const step1 = {
    contactBrandName: parsed.data.contactBrandName,
    contactManagerProfile: parsed.data.contactManagerProfile,
    contactEmail: parsed.data.contactEmail,
    contactPhone: parsed.data.contactPhone,
  };

  if (!hasAnyBrandContactInput(step1)) {
    return NextResponse.json({ error: "최소 한 항목 이상 입력해 주세요." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: authResult.session.user.id },
    data: brandContactToUserUpdateData(step1),
  });

  const user = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    select: { brandName: true, name: true, email: true, brandContactEmail: true, contactPhoneE164: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ profile: userToBrandContactStep1(user) });
}
