"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CREATOR_LOCALES, isCreatorLocale } from "@/lib/creators-i18n";
import { cn } from "@/lib/utils";

type LangLabels = {
  label: string;
  en: string;
  ko: string;
  zh: string;
  ja: string;
};

export function CreatorsLanguageSwitcher({ lang }: { lang: LangLabels }) {
  const params = useParams();
  const raw = params?.locale;
  const current = typeof raw === "string" && isCreatorLocale(raw) ? raw : "en";

  return (
    <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
      <span className="mr-1 text-muted-foreground">{lang.label}</span>
      {CREATOR_LOCALES.map((code) => (
        <Link
          key={code}
          href={`/creators/${code}`}
          className={cn(
            "rounded-md px-2 py-1 font-medium transition-colors",
            current === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          hrefLang={code === "zh" ? "zh-Hans" : code}
        >
          {lang[code]}
        </Link>
      ))}
    </div>
  );
}
