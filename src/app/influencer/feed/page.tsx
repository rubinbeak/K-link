import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MiniVisualMotif } from "@/components/visual/mini-visual-motif";
import { campaignStatusClass } from "@/lib/status-styles";
import { ApplyButton } from "./apply-button";

export default async function InfluencerFeedPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "INFLUENCER") redirect("/login");

  const campaigns = await prisma.campaign.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      brand: { select: { brandName: true, name: true, email: true } },
      applications: {
        where: { influencerId: session.user.id },
        select: { id: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Open campaigns</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Browse K-beauty collaborations. Apply once per campaign; brands review and select creators.
        </p>
      </div>

      <MiniVisualMotif
        title="Influencer flow snapshot"
        description="Track matching momentum and campaign delivery pace at a glance."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {campaigns.map((c) => {
          const applied = c.applications.length > 0;
          return (
            <Card key={c.id} className="flex flex-col border-border/60 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="font-heading text-lg leading-snug">{c.title}</CardTitle>
                  <Badge className={campaignStatusClass(c.status)} variant="secondary">
                    {c.status}
                  </Badge>
                </div>
                <CardDescription className="text-pretty line-clamp-4">{c.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
                <p>
                  Brand:{" "}
                  <span className="font-medium text-foreground">
                    {c.brand.brandName ?? c.brand.name ?? c.brand.email}
                  </span>
                </p>
                <p>
                  Budget:{" "}
                  <span className="font-medium text-foreground">${c.budget.toLocaleString()}</span>
                </p>
              </CardContent>
              <CardFooter className="border-t border-border/60 bg-muted/10">
                <ApplyButton campaignId={c.id} disabled={applied} applied={applied} />
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No open campaigns right now. Check back soon.</p>
      ) : null}
    </div>
  );
}
