export const campaignStatusKo: Record<string, string> = {
  OPEN: "모집 중",
  CLOSED: "종료",
};

export const applicationStatusKo: Record<string, string> = {
  PENDING: "검토 대기",
  SELECTED: "선정",
  REJECTED: "반려",
  SUBMITTED: "제출 완료",
};

export const paymentStatusKo: Record<string, string> = {
  PENDING: "입금 대기",
  COMPLETED: "결제 완료",
  FAILED: "실패",
};

export function campaignStatusLabel(status: string) {
  return campaignStatusKo[status] ?? status;
}

export function applicationStatusLabel(status: string) {
  return applicationStatusKo[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  return paymentStatusKo[status] ?? status;
}
