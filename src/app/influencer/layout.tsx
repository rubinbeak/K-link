import { PortalHeader } from "@/components/layout/portal-header";

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader
        title="Creator"
        nav={[
          { href: "/influencer/feed", label: "Campaign feed" },
          { href: "/influencer/my", label: "My page" },
        ]}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
