export const COUNTRY_CODE_OPTIONS = [
  { value: "+82", label: "대한민국 (+82)" },
  { value: "+1", label: "미국/캐나다 (+1)" },
  { value: "+81", label: "일본 (+81)" },
  { value: "+86", label: "중국 (+86)" },
  { value: "+65", label: "싱가포르 (+65)" },
  { value: "+971", label: "아랍에미리트 (+971)" },
  { value: "+44", label: "영국 (+44)" },
] as const;

export type CountryCodeValue = (typeof COUNTRY_CODE_OPTIONS)[number]["value"];

export function normalizeToE164(countryCode: string, phoneRaw: string) {
  const cc = countryCode.replace(/[^\d]/g, "");
  const digits = phoneRaw.replace(/[^\d]/g, "");

  if (!cc || !digits) return null;

  let national = digits;
  if (national.startsWith(cc)) national = national.slice(cc.length);
  if (national.startsWith("0")) national = national.slice(1);
  if (!national) return null;

  return `+${cc}${national}`;
}
