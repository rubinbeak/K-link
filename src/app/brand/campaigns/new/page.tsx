import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createCampaignForm } from "../../actions";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function NewCampaignPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BRAND") redirect("/login");

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <Link
          href="/brand"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to dashboard
        </Link>
        <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight">New campaign</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A pending payment record is created with the same amount for admin verification (MVP).
        </p>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Campaign details</CardTitle>
          <CardDescription>Title, brief, and budget in USD.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCampaignForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="e.g. Vegan sunscreen summer push" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Deliverables, tone, hashtags, and timeline."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input id="budget" name="budget" type="number" min={1} step={1} required placeholder="2500" />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit">Publish campaign</Button>
              <Link href="/brand" className={cn(buttonVariants({ variant: "outline" }))}>
                Cancel
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
