export const CREATOR_LOCALES = ["en", "ko", "zh", "ja"] as const;

export type CreatorLocale = (typeof CREATOR_LOCALES)[number];

export function isCreatorLocale(value: string): value is CreatorLocale {
  return (CREATOR_LOCALES as readonly string[]).includes(value);
}

const LOCALE_ALIASES: Record<string, CreatorLocale> = {
  "zh-cn": "zh",
  "zh-hans": "zh",
  "zh-tw": "zh",
  ja: "ja",
  ko: "ko",
  en: "en",
};

/** Pick best locale from Accept-Language header; fallback en */
export function pickCreatorLocale(acceptLanguage: string | null): CreatorLocale {
  if (!acceptLanguage) return "en";
  const parts = acceptLanguage.split(",").map((p) => p.trim().split(";")[0]?.toLowerCase() ?? "");
  for (const raw of parts) {
    const base = raw.split("-")[0] ?? raw;
    if (isCreatorLocale(raw)) return raw;
    const alias = LOCALE_ALIASES[raw] ?? LOCALE_ALIASES[base];
    if (alias) return alias;
    if (isCreatorLocale(base)) return base;
  }
  return "en";
}

export function htmlLangForCreatorLocale(locale: CreatorLocale): string {
  switch (locale) {
    case "zh":
      return "zh-Hans";
    case "ja":
      return "ja";
    case "ko":
      return "ko";
    default:
      return "en";
  }
}

export async function getCreatorMessages(locale: CreatorLocale) {
  switch (locale) {
    case "ko":
      return import("@/messages/creators/ko.json").then((m) => m.default);
    case "zh":
      return import("@/messages/creators/zh.json").then((m) => m.default);
    case "ja":
      return import("@/messages/creators/ja.json").then((m) => m.default);
    default:
      return import("@/messages/creators/en.json").then((m) => m.default);
  }
}

export type CreatorMessages = Awaited<ReturnType<typeof getCreatorMessages>>;
