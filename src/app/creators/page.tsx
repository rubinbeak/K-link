import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { pickCreatorLocale } from "@/lib/creators-i18n";

export default async function CreatorsIndexPage() {
  const h = await headers();
  const accept = h.get("accept-language");
  redirect(`/creators/${pickCreatorLocale(accept)}`);
}
