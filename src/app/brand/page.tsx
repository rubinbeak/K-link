import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicantActionButtons } from "./applicant-actions";
import { applicationStatusClass, campaignLifecycleClass, campaignStatusClass, paymentStatusClass } from "@/lib/status-styles";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { BrandBasicInfoSection } from "@/components/brand/brand-basic-info-section";
import { userToBrandContactStep1 } from "@/lib/brand-profile";
import {
  applicationStatusLabel,
  campaignLifecycleLabel,
  campaignStatusLabel,
  campaignTypeLabel,
  paymentStatusLabel,
} from "@/lib/brand-ui-labels";

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

  return (
    <div className="space-y-10">
      <h1 className="font-heading text-center text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        마이페이지
      </h1>

      <BrandBasicInfoSection initialProfile={initialProfile} />

      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">내 캠페인</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            등록·제출하신 캠페인 요약입니다. 결제 안내와 인보이스는 각 캠페인 카드에서 바로 열 수 있습니다.
          </p>
        </div>

        {campaigns.length === 0 ? (
          <Card className="border-dashed">
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
          <div className="grid gap-5 lg:grid-cols-2">
            {campaigns.map((c) => {
              const payment = c.payments[0];
              const visit = c.visitDetail;
              const visitLine = visit
                ? `${visit.eventStartDate.toLocaleDateString("ko-KR")}${
                    visit.eventEndDate ? ` ~ ${visit.eventEndDate.toLocaleDateString("ko-KR")}` : ""
                  }`
                : null;

              return (
                <Card key={c.id} className="flex flex-col overflow-hidden border-border/60 shadow-sm">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <CardTitle className="font-heading text-lg leading-snug sm:text-xl">{c.title}</CardTitle>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge className={campaignLifecycleClass(c.lifecycle)} variant="secondary">
                          {campaignLifecycleLabel(c.lifecycle)}
                        </Badge>
                        <Badge className={campaignStatusClass(c.status)} variant="secondary">
                          {campaignStatusLabel(c.status)}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-pretty text-xs sm:text-sm">
                      {c.description.length > 160 ? `${c.description.slice(0, 160)}…` : c.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="grid gap-3 border-t border-border/50 bg-muted/20 px-4 py-4 text-sm">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">캠페인 ID</p>
                        <p className="mt-0.5 font-mono text-xs text-foreground">{c.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">유형</p>
                        <p className="mt-0.5 text-foreground">{campaignTypeLabel(c.campaignType)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">등록일</p>
                        <p className="mt-0.5 text-foreground">{c.createdAt.toLocaleString("ko-KR")}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">견적(예산)</p>
                        <p className="mt-0.5 font-medium text-foreground">
                          {Math.round(c.budget).toLocaleString("ko-KR")}원
                        </p>
                      </div>
                      {visitLine ? (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-muted-foreground">방문 일정(대표)</p>
                          <p className="mt-0.5 text-foreground">{visitLine}</p>
                          {visit?.address ? (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{visit.address}</p>
                          ) : null}
                        </div>
                      ) : null}
                      {payment ? (
                        <div className="sm:col-span-2">
                          <p className="text-xs font-medium text-muted-foreground">결제</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <Badge className={paymentStatusClass(payment.status)} variant="secondary">
                              {paymentStatusLabel(payment.status)}
                            </Badge>
                            <span className="text-muted-foreground">
                              {Math.round(payment.amount).toLocaleString("ko-KR")}원
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground">연결된 결제 건이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {payment ? (
                    <CardFooter className="flex flex-wrap gap-2 border-t bg-muted/40">
                      <Link
                        href={`/campaign/setup/complete/${payment.id}`}
                        className={cn(
                          buttonVariants({ size: "sm", className: "bg-[#ff2f9b] text-white hover:bg-[#e61c8d]" }),
                        )}
                      >
                        결제·완료 안내
                      </Link>
                      <Link href={`/brand/payments/${payment.id}/invoice`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                        인보이스 화면
                      </Link>
                      <a
                        href={`/api/payments/${payment.id}/invoice/download`}
                        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                      >
                        PDF 다운로드
                      </a>
                    </CardFooter>
                  ) : null}

                  {c.applications.length > 0 ? (
                    <div className="border-t border-border/60 px-4 py-3">
                      <details className="group">
                        <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                          <span className="inline-flex items-center gap-2">
                            지원자 {c.applications.length}명
                            <span className="text-xs font-normal text-muted-foreground group-open:hidden">펼치기</span>
                            <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">접기</span>
                          </span>
                        </summary>
                        <ul className="mt-4 space-y-3">
                          {c.applications.map((a) => (
                            <li
                              key={a.id}
                              className="flex flex-col gap-3 rounded-lg border border-border/60 bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">{a.influencer.name ?? a.influencer.email}</p>
                                <p className="text-xs text-muted-foreground">{a.influencer.email}</p>
                                {a.influencer.bio ? (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{a.influencer.bio}</p>
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
                      </details>
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
