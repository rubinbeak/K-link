import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { REGION_VALUES } from "@/lib/visit-campaign";

const schema = z.object({
  channel: z.enum(["KAKAO", "MEETING"]),
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  targetRegion: z.enum(REGION_VALUES).optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const session = await auth();
  const lead = await prisma.consultingLead.create({
    data: {
      userId: session?.user?.id ?? null,
      channel: parsed.data.channel,
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      targetRegion: parsed.data.targetRegion,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ leadId: lead.id, status: lead.status }, { status: 201 });
}
