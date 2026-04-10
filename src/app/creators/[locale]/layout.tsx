import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { CreatorsLanguageSwitcher } from "@/components/creators/creators-language-switcher";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  getCreatorMessages,
  htmlLangForCreatorLocale,
  isCreatorLocale,
  type CreatorLocale,
} from "@/lib/creators-i18n";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: CreatorLocale = isCreatorLocale(raw) ? raw : "en";
  const t = await getCreatorMessages(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      languages: {
        en: "/creators/en",
        ko: "/creators/ko",
        "zh-Hans": "/creators/zh",
        ja: "/creators/ja",
      },
    },
  };
}

export default async function CreatorsLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: CreatorLocale = isCreatorLocale(raw) ? raw : "en";
  const t = await getCreatorMessages(locale);
  const session = await auth();

  return (
    <div
      lang={htmlLangForCreatorLocale(locale)}
      className={cn(
        "min-h-dvh bg-linear-to-b from-[#f8fafc] via-background to-background dark:from-[#0f1419]",
        locale === "zh" && "font-sans",
        locale === "ja" && "font-sans",
      )}
      style={
        locale === "zh"
          ? { fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", "Apple SD Gothic Neo", sans-serif' }
          : locale === "ja"
            ? { fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic UI", "Meiryo", sans-serif' }
            : undefined
      }
    >
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-4 lg:py-4">
          <div className="flex flex-wrap items-center gap-2 lg:justify-self-start">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              <span className="text-primary">K-LINK</span>
            </Link>
            <span className="text-border">·</span>
            <span className="text-sm text-muted-foreground">{t.hero.eyebrow}</span>
          </div>
          <div className="flex justify-center lg:justify-center">
            <CreatorsLanguageSwitcher lang={t.lang} />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 lg:justify-self-end">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-muted-foreground")}
            >
              {t.nav.brandSite}
            </Link>
            {session?.user ? (
              <Link
                href={
                  session.user.role === "INFLUENCER"
                    ? "/influencer/feed"
                    : session.user.role === "BRAND"
                      ? "/brand"
                      : "/admin"
                }
                className={cn(buttonVariants({ size: "sm" }))}
              >
                {t.nav.portal}
              </Link>
            ) : (
              <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
                {t.nav.login}
              </Link>
            )}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
