/** 캠페인 세팅 제출 직후 결제·인보이스 안내(새 창) */
export function openCampaignSetupCompleteInNewTab(paymentId: string) {
  if (typeof window === "undefined") return;
  const path = `/campaign/setup/complete/${paymentId}`;
  const url = `${window.location.origin}${path}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
