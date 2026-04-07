import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { Separator } from "@/components/ui/separator";
import { ApplicantActionButtons } from "./applicant-actions";
import { applicationStatusClass, campaignStatusClass } from "@/lib/status-styles";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function BrandDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") redirect("/login");

  const campaigns = await prisma.campaign.findMany({
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
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Campaigns</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Review applicants, select creators, and track collaboration progress.
          </p>
        </div>
        <Link href="/campaign/setup" className={cn(buttonVariants())}>
          Campaign setup
        </Link>
      </div>

      <MiniVisualMotif
        title="Brand dashboard snapshot"
        description="Quickly review campaign conversion before checking applicant details."
      />

      {campaigns.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No campaigns yet</CardTitle>
            <CardDescription>Create your first campaign to invite global creators.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/campaign/setup" className={cn(buttonVariants())}>
              Start campaign setup
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
                    {c.status}
                  </Badge>
                </div>
                <CardDescription className="text-pretty">{c.description}</CardDescription>
                <p className="text-sm text-muted-foreground">
                  Budget <span className="font-medium text-foreground">${c.budget.toLocaleString()}</span>
                </p>
                {c.payments[0] ? (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="outline">Payment: {c.payments[0].status}</Badge>
                    <Link
                      href={`/brand/payments/${c.payments[0].id}/invoice`}
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Invoice 보기
                    </Link>
                  </div>
                ) : null}
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <h3 className="text-sm font-medium text-foreground">Applicants</h3>
                {c.applications.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No applications yet.</p>
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
                              {a.status}
                            </Badge>
                            {a.contentUrl ? (
                              <a
                                href={a.contentUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                              >
                                View content
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
