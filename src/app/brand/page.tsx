import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getBrandCampaignCarouselItems } from "@/lib/brand-campaign-carousel-data";
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

  const [user, carouselItems] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { brandName: true, name: true, email: true, contactPhoneE164: true },
    }),
    getBrandCampaignCarouselItems(session.user.id),
  ]);

  const initialProfile = userToBrandContactStep1(
    user ?? {
      brandName: null,
      name: null,
      email: session.user.email ?? "",
      contactPhoneE164: null,
    },
  );

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

        {carouselItems.length === 0 ? (
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
