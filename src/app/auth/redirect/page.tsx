import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/my");

  switch (session.user.role) {
    case "BRAND":
      redirect("/brand");
    case "INFLUENCER":
      redirect("/influencer/my");
    case "ADMIN":
      redirect("/admin");
    default:
      redirect("/my");
  }
}
