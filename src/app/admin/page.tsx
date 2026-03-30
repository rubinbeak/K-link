import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignStatusSelect } from "./campaign-status-select";
import { PaymentStatusSelect } from "./payment-status-select";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");

  const [userCount, campaignCount, openCampaigns, campaigns, payments, applications] =
    await Promise.all([
      prisma.user.count(),
      prisma.campaign.count(),
      prisma.campaign.count({ where: { status: "OPEN" } }),
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        include: { brand: { select: { email: true, brandName: true, name: true } } },
      }),
      prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          brand: { select: { email: true, brandName: true } },
          campaign: { select: { title: true } },
        },
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          campaign: { select: { title: true } },
          influencer: { select: { email: true, name: true } },
        },
      }),
    ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Operations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor users, campaigns, applications, and payment verification.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total users</CardDescription>
            <CardTitle className="font-heading text-3xl">{userCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Active campaigns</CardDescription>
            <CardTitle className="font-heading text-3xl">{openCampaigns}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Status OPEN</CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>All campaigns</CardDescription>
            <CardTitle className="font-heading text-3xl">{campaignCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>
        <TabsContent value="campaigns" className="mt-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Campaign management</CardTitle>
              <CardDescription>Update status for any campaign on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Brand</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="max-w-[200px] font-medium">{c.title}</TableCell>
                      <TableCell className="hidden text-muted-foreground md:table-cell">
                        {c.brand.brandName ?? c.brand.name ?? c.brand.email}
                      </TableCell>
                      <TableCell>${c.budget.toLocaleString()}</TableCell>
                      <TableCell>
                        <CampaignStatusSelect campaignId={c.id} value={c.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments" className="mt-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Payments</CardTitle>
              <CardDescription>Verify and reconcile brand payments (MVP).</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead className="hidden sm:table-cell">Campaign</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.brand.brandName ?? p.brand.email}
                      </TableCell>
                      <TableCell className="hidden max-w-[180px] text-muted-foreground sm:table-cell">
                        {p.campaign?.title ?? "—"}
                      </TableCell>
                      <TableCell>${p.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <PaymentStatusSelect paymentId={p.id} value={p.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Recent applications</CardTitle>
              <CardDescription>Latest creator applications and submission states.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Content</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="max-w-[200px]">{a.campaign.title}</TableCell>
                      <TableCell>
                        <div className="font-medium">{a.influencer.name ?? a.influencer.email}</div>
                        <div className="text-xs text-muted-foreground">{a.influencer.email}</div>
                      </TableCell>
                      <TableCell>{a.status}</TableCell>
                      <TableCell className="hidden max-w-[220px] lg:table-cell">
                        {a.contentUrl ? (
                          <a
                            href={a.contentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            Link
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
