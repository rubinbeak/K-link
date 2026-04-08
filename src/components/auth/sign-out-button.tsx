"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      로그아웃
    </Button>
  );
}
