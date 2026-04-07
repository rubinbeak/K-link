import { PortalHeader } from "@/components/layout/portal-header";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader
        title="Brand"
        nav={[
          { href: "/brand", label: "My page" },
          { href: "/campaign/setup", label: "Campaign setup" },
        ]}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
