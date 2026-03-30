"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { applyToCampaign } from "../actions";

export function ApplyButton({
  campaignId,
  disabled,
  applied,
}: {
  campaignId: string;
  disabled: boolean;
  applied: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <Button
      type="button"
      className="w-full sm:w-auto"
      disabled={disabled || pending}
      onClick={() => start(() => applyToCampaign(campaignId))}
    >
      {applied ? "Applied" : pending ? "Applying…" : "Apply"}
    </Button>
  );
}
