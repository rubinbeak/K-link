import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-auth";
import { brandContactToUserUpdateData, userToBrandContactStep1 } from "@/lib/brand-profile";

const patchSchema = z.object({
  contactBrandName: z.string(),
  contactManagerProfile: z.string(),
  contactPhone: z.string(),
});

export async function GET() {
  const authResult = await requireRole("BRAND");
  if (!authResult.ok) return authResult.response;

  const user = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    select: { brandName: true, name: true, email: true, contactPhoneE164: true },
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

  const userRow = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    select: { email: true },
  });
  if (!userRow?.email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const step1 = {
    contactBrandName: parsed.data.contactBrandName,
    contactManagerProfile: parsed.data.contactManagerProfile,
    contactEmail: userRow.email,
    contactPhone: parsed.data.contactPhone,
  };

  if (
    !parsed.data.contactBrandName.trim() &&
    !parsed.data.contactManagerProfile.trim() &&
    !parsed.data.contactPhone.trim()
  ) {
    return NextResponse.json(
      { error: "회사/브랜드명, 담당자, 연락처 중 최소 한 항목은 입력해 주세요." },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: authResult.session.user.id },
    data: brandContactToUserUpdateData(step1),
  });

  const user = await prisma.user.findUnique({
    where: { id: authResult.session.user.id },
    select: { brandName: true, name: true, email: true, contactPhoneE164: true },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ profile: userToBrandContactStep1(user) });
}
