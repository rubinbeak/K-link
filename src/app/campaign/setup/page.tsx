import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CampaignSetupWizard } from "@/components/campaign/campaign-setup-wizard";

export default async function CampaignSetupPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "BRAND") redirect("/brand");

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/20 blur-3xl" />
      </div>
      <main className="relative mx-auto max-w-6xl px-4 py-10">
        <Link href="/for-brands" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
          ← 브랜드 페이지
        </Link>
        <CampaignSetupWizard />
      </main>
    </div>
  );
}
