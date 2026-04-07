import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  switch (session.user.role) {
    case "BRAND":
      redirect("/brand");
    case "INFLUENCER":
      redirect("/for-brands");
    case "ADMIN":
      redirect("/admin");
    default:
      redirect("/for-brands");
  }
}
