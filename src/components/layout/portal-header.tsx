import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function PortalHeader({
  title,
  nav,
  className,
}: {
  title: string;
  nav: NavItem[];
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/for-brands" className="font-semibold tracking-tight text-foreground">
            <span className="text-primary">K-LINK</span>
            <span className="text-muted-foreground"> · {title}</span>
          </Link>
          <SignOutButton className="sm:hidden" />
        </div>
        <nav className="flex flex-wrap items-center gap-2 sm:gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <SignOutButton className="hidden sm:inline-flex" />
        </nav>
      </div>
    </header>
  );
}
