export const campaignStatusKo: Record<string, string> = {
  OPEN: "모집 중",
  CLOSED: "종료",
};

/** 캠페인 운영 단계 (세팅·결제 이후) */
export const campaignLifecycleKo: Record<string, string> = {
  DRAFT: "초안",
  READY_FOR_PAYMENT: "결제 대기",
  PAID: "결제 완료",
  GUIDELINE_IN_PROGRESS: "가이드라인 작성 중",
  GUIDELINE_CONFIRMED: "가이드라인 확정",
  INFLUENCER_LIST_DELIVERED: "인플루언서 리스트 전달",
  VISIT_SCHEDULED: "방문 일정 확정",
  VISIT_DONE: "방문 완료",
  CONTENT_UPLOADED: "콘텐츠 업로드",
  REPORT_DELIVERED: "보고서 전달",
  COMPLETED: "캠페인 완료",
  CANCELLED: "취소",
};

export const campaignTypeKo: Record<string, string> = {
  VISIT_CONTENT: "방문형 콘텐츠",
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

export function campaignLifecycleLabel(status: string) {
  return campaignLifecycleKo[status] ?? status;
}

export function campaignTypeLabel(type: string | null | undefined) {
  if (!type) return "—";
  return campaignTypeKo[type] ?? type;
}

export function applicationStatusLabel(status: string) {
  return applicationStatusKo[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  return paymentStatusKo[status] ?? status;
}
