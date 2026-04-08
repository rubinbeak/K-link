import { redirect } from "next/navigation";
import { ConsultingForm } from "@/app/consulting/consulting-form";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { userToBrandContactStep1 } from "@/lib/brand-profile";

export default async function ConsultingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/consulting");
  }
  if (session.user.role !== "BRAND") {
    redirect("/auth/redirect");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { brandName: true, name: true, email: true, contactPhoneE164: true },
  });
  const profile = userToBrandContactStep1(
    user ?? {
      brandName: null,
      name: null,
      email: session.user.email ?? "",
      contactPhoneE164: null,
    },
  );
  const defaultContact = {
    brandName: profile.contactBrandName,
    managerProfile: profile.contactManagerProfile,
    email: profile.contactEmail,
    phone: profile.contactPhone,
  };

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />
        <div className="absolute right-0 top-56 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="font-heading text-4xl font-semibold tracking-tight leading-tight sm:text-5xl">캠페인 상담하기</h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-zinc-600 sm:text-base">
            브랜드 상황에 맞는 인플루언서 캠페인 제안을 위해 핵심 정보만 먼저 입력해 주세요.
            <br className="hidden sm:block" />
            접수된 내용을 기준으로 운영팀이 실행 가능한 제안을 순차적으로 안내합니다.
          </p>
        </section>

        <section className="mx-auto mt-14 max-w-6xl">
          <ConsultingForm defaultContact={defaultContact} />
        </section>
      </main>
    </div>
  );
}
