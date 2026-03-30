import { PortalHeader } from "@/components/layout/portal-header";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader
        title="Brand"
        nav={[
          { href: "/brand", label: "Dashboard" },
          { href: "/brand/campaigns/new", label: "New campaign" },
        ]}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
