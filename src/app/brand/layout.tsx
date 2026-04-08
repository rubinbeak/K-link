import { PortalHeader } from "@/components/layout/portal-header";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader
        title="브랜드"
        nav={[
          { href: "/brand", label: "마이페이지" },
          { href: "/campaign/setup", label: "캠페인 세팅" },
        ]}
      />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
