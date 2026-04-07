import { redirect } from "next/navigation";

export default async function NewCampaignPage() {
  redirect("/campaign/setup");
}
