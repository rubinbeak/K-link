"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { rejectApplicant, selectApplicant } from "./actions";

export function ApplicantActionButtons({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const [pending, start] = useTransition();
  const done = currentStatus !== "PENDING";

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        disabled={pending || done}
        onClick={() => start(() => selectApplicant(applicationId))}
      >
        선정
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending || done}
        onClick={() => start(() => rejectApplicant(applicationId))}
      >
        반려
      </Button>
    </div>
  );
}
