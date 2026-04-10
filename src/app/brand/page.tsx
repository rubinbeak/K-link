import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { BrandBasicInfoSection } from "@/components/brand/brand-basic-info-section";
import { BrandMyCampaignsCarousel } from "@/components/brand/brand-my-campaigns-carousel";
import { userToBrandContactStep1 } from "@/lib/brand-profile";

export default async function BrandDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") redirect("/login");

  const [user, campaigns] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { brandName: true, name: true, email: true, contactPhoneE164: true },
    }),
    prisma.campaign.findMany({
      where: { brandId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        visitDetail: {
          select: {
            eventStartDate: true,
            eventEndDate: true,
            address: true,
          },
        },
        applications: {
          include: { influencer: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  const initialProfile = userToBrandContactStep1(
    user ?? {
      brandName: null,
      name: null,
      email: session.user.email ?? "",
      contactPhoneE164: null,
    },
  );

  const carouselItems = campaigns.map((c) => {
    const payment = c.payments[0];
    const visit = c.visitDetail;
    const visitLine = visit
      ? `${visit.eventStartDate.toLocaleDateString("ko-KR")}${
          visit.eventEndDate ? ` ~ ${visit.eventEndDate.toLocaleDateString("ko-KR")}` : ""
        }`
      : null;

    return {
      id: c.id,
      title: c.title,
      description: c.description,
      lifecycle: c.lifecycle,
      status: c.status,
      campaignType: c.campaignType,
      createdAtLabel: c.createdAt.toLocaleString("ko-KR"),
      budget: c.budget,
      visitLine,
      visitAddress: visit?.address ?? null,
      payment: payment
        ? { id: payment.id, status: payment.status, amount: payment.amount }
        : null,
      applications: c.applications.map((a) => ({
        id: a.id,
        status: a.status,
        contentUrl: a.contentUrl,
        influencer: {
          name: a.influencer.name,
          email: a.influencer.email,
          bio: a.influencer.bio,
        },
      })),
    };
  });

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        마이페이지
      </h1>

      <BrandBasicInfoSection initialProfile={initialProfile} />

      <section className="space-y-6">
        <div className="mx-auto max-w-2xl space-y-2 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">내 캠페인</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            등록·제출하신 캠페인 요약입니다. 결제 안내와 인보이스는 각 캠페인 카드에서 바로 열 수 있습니다.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <Card className="mx-auto max-w-lg border-dashed">
            <CardHeader className="items-center justify-items-center space-y-2 text-center">
              <CardTitle className="text-xl">아직 표시할 캠페인이 없습니다</CardTitle>
              <CardDescription className="mx-auto max-w-md text-pretty text-base">
                캠페인 세팅을 완료하고 제출하면 이 목록에 요약이 나타납니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-2">
              <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }))}>
                캠페인 세팅하기
              </Link>
            </CardContent>
          </Card>
        ) : (
          <BrandMyCampaignsCarousel campaigns={carouselItems} />
        )}
      </section>
    </div>
  );
}
