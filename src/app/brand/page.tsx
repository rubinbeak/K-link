import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplicantActionButtons } from "./applicant-actions";
import { applicationStatusClass, campaignStatusClass } from "@/lib/status-styles";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { BrandBasicInfoSection } from "@/components/brand/brand-basic-info-section";
import { userToBrandContactStep1 } from "@/lib/brand-profile";
import { applicationStatusLabel, campaignStatusLabel, paymentStatusLabel } from "@/lib/brand-ui-labels";

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

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        마이페이지
      </h1>

      <BrandBasicInfoSection initialProfile={initialProfile} />

      {campaigns.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="items-center justify-items-center space-y-2 text-center">
            <CardTitle className="text-xl">등록된 캠페인이 없습니다</CardTitle>
            <CardDescription className="mx-auto max-w-md text-pretty text-base">
              첫 캠페인을 만들고 글로벌 크리에이터를 초대해 보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-2">
            <Link href="/campaign/setup" className={cn(buttonVariants({ size: "lg" }))}>
              캠페인 세팅 시작하기
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {campaigns.map((c) => (
            <Card key={c.id} className="overflow-hidden border-border/60 shadow-sm">
              <CardHeader className="space-y-2 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="font-heading text-xl">{c.title}</CardTitle>
                  <Badge className={campaignStatusClass(c.status)} variant="secondary">
                    {campaignStatusLabel(c.status)}
                  </Badge>
                </div>
                <CardDescription className="text-pretty">{c.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  예산{" "}
                  <span className="font-medium text-foreground">
                    {Math.round(c.budget).toLocaleString("ko-KR")}원
                  </span>
                </p>
                {c.payments[0] ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline">결제: {paymentStatusLabel(c.payments[0].status)}</Badge>
                    <Link
                      href={`/brand/payments/${c.payments[0].id}/invoice`}
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      청구서 보기
                    </Link>
                  </div>
                ) : null}
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-foreground">지원자</h3>
                {c.applications.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">아직 지원자가 없습니다.</p>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {c.applications.map((a) => (
                      <li
                        key={a.id}
                        className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{a.influencer.name ?? a.influencer.email}</p>
                          <p className="text-xs text-muted-foreground">{a.influencer.email}</p>
                          {a.influencer.bio ? (
                            <p className="text-sm text-muted-foreground">{a.influencer.bio}</p>
                          ) : null}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <Badge className={applicationStatusClass(a.status)} variant="secondary">
                              {applicationStatusLabel(a.status)}
                            </Badge>
                            {a.contentUrl ? (
                              <a
                                href={a.contentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                              >
                                콘텐츠 보기
                              </a>
                            ) : null}
                          </div>
                        </div>
                        <ApplicantActionButtons applicationId={a.id} currentStatus={a.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
