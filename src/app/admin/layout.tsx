import { PortalHeader } from "@/components/layout/portal-header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <PortalHeader title="Admin" nav={[{ href: "/admin", label: "Overview" }]} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
