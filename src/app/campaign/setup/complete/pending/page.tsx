import { Suspense } from "react";
import { FinalizePendingClient } from "./finalize-pending-client";

function PendingFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <p className="text-sm text-zinc-600">불러오는 중…</p>
    </div>
  );
}

export default function CampaignFinalizePendingPage() {
  return (
    <Suspense fallback={<PendingFallback />}>
      <FinalizePendingClient />
    </Suspense>
  );
}
