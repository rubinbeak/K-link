import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { Role } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { normalizeToE164 } from "@/lib/phone";

const signupSchema = z
  .object({
    brandName: z.string().trim().min(1, "브랜드 이름을 입력해 주세요."),
    managerName: z.string().trim().min(1, "담당자 이름을 입력해 주세요."),
    countryCode: z.string().regex(/^\+\d{1,3}$/, "국가 코드를 선택해 주세요."),
    contactPhone: z.string().trim().min(1, "전화번호를 입력해 주세요."),
    email: z.string().trim().email("올바른 이메일 형식을 입력해 주세요."),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 409 });
  }

  const phoneE164 = normalizeToE164(parsed.data.countryCode, parsed.data.contactPhone);
  if (!phoneE164) {
    return NextResponse.json(
      { error: "전화번호 형식을 확인해 주세요.", fields: { contactPhone: ["올바른 전화번호를 입력해 주세요."] } },
      { status: 400 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 10);
  try {
    await prisma.user.create({
      data: {
        role: Role.BRAND,
        email,
        password: passwordHash,
        name: parsed.data.managerName,
        brandName: parsed.data.brandName,
        contactPhoneE164: phoneE164,
        bio: `연락처: ${phoneE164}`,
      },
    });
  } catch {
    // DB 스키마 반영 전 환경 대비: 연락처는 bio에라도 보존
    await prisma.user.create({
      data: {
        role: Role.BRAND,
        email,
        password: passwordHash,
        name: parsed.data.managerName,
        brandName: parsed.data.brandName,
        bio: `연락처: ${phoneE164}`,
      },
    });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
