import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { Separator } from "@/components/ui/separator";
import { applicationStatusClass } from "@/lib/status-styles";
import { SubmitLinkForm } from "./submit-link-form";

export default async function InfluencerMyPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "INFLUENCER") redirect("/login");

  const profile = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { bio: true, instagram: true, tiktok: true },
  });

  const applications = await prisma.application.findMany({
    where: { influencerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: {
        include: { brand: { select: { brandName: true, name: true } } },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">My page</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Track applications and submit content links when a brand selects you.
          </p>
        </div>
        <Link
          href="/influencer/feed"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Browse campaigns →
        </Link>
      </div>

      <MiniVisualMotif
        title="My campaign progress"
        description="See your application-to-upload status in the same visual language."
      />

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Visible to brands when you apply.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span>{" "}
            <span className="font-medium">{session.user.name ?? "—"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            <span className="font-medium">{session.user.email}</span>
          </p>
          {profile?.bio ? (
            <p>
              <span className="text-muted-foreground">Bio:</span>{" "}
              <span className="font-medium">{profile.bio}</span>
            </p>
          ) : null}
          {profile?.instagram ? (
            <p>
              <span className="text-muted-foreground">Instagram:</span>{" "}
              <span className="font-medium">{profile.instagram}</span>
            </p>
          ) : null}
          {profile?.tiktok ? (
            <p>
              <span className="text-muted-foreground">TikTok:</span>{" "}
              <span className="font-medium">{profile.tiktok}</span>
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Applications</h2>
        {applications.length === 0 ? (
          <p className="text-sm text-muted-foreground">You have not applied to any campaigns yet.</p>
        ) : (
          <ul className="space-y-4">
            {applications.map((a) => (
              <li key={a.id}>
                <Card className="border-border/60">
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="font-heading text-base">{a.campaign.title}</CardTitle>
                      <Badge className={applicationStatusClass(a.status)} variant="secondary">
                        {a.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {a.campaign.brand.brandName ?? a.campaign.brand.name ?? "Brand"}
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardContent className="space-y-4 pt-4">
                    {a.contentUrl ? (
                      <p className="text-sm">
                        <span className="text-muted-foreground">Submitted: </span>
                        <a
                          href={a.contentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          {a.contentUrl}
                        </a>
                      </p>
                    ) : null}
                    {a.status === "SELECTED" ? (
                      <SubmitLinkForm applicationId={a.id} />
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
