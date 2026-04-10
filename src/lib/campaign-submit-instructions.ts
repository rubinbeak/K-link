export type CampaignSubmitInstructions = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  /** 입금 시 참조코드 안내 (제출 후 인보이스에서 발급) */
  referenceNote: string;
  /** 입금 확인 이후 브랜드와의 소통 방식 */
  postPaymentContact: string;
  /** 세금계산서·증빙 발급 절차 */
  taxInvoiceProcess: string;
};

const DEFAULT_POST_PAYMENT =
  "입금 확인 후 담당자가 등록하신 연락처를 바탕으로 카카오톡 비즈니스 채널 또는 이메일로 먼저 연락드립니다. 정확한 채널·주소는 안내 메시지에 포함됩니다.";

const DEFAULT_TAX_INVOICE =
  "세금계산서(또는 필요 시 거래 명세)는 발행 후 카카오톡 비즈니스 채널 또는 이메일로 송부드립니다. 사업자 정보 보완이 필요하면 담당자 이메일로 별도 요청드릴 수 있습니다.";

/**
 * 캠페인 제출 전 안내 문구. 계좌는 `invoice.ts`와 동일한 BANK_* 환경 변수를 사용합니다.
 * 운영 문구는 BRAND_POST_PAYMENT_CONTACT, BRAND_TAX_INVOICE_PROCESS 로 덮어쓸 수 있습니다.
 */
export function getCampaignSubmitInstructions(): CampaignSubmitInstructions {
  return {
    bankName: process.env.BANK_NAME ?? "IBK 기업은행",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "289-127559-04-029",
    accountHolder: process.env.BANK_ACCOUNT_HOLDER ?? "백은진",
    referenceNote:
      process.env.CAMPAIGN_SUBMIT_REFERENCE_NOTE?.trim() ||
      "제출이 완료되면 열리는 인보이스 화면에서 참조코드(Reference)를 확인하실 수 있습니다. 입금 시 이체 메모 또는 입금자명에 해당 코드를 함께 기재해 주세요.",
    postPaymentContact: process.env.BRAND_POST_PAYMENT_CONTACT?.trim() || DEFAULT_POST_PAYMENT,
    taxInvoiceProcess: process.env.BRAND_TAX_INVOICE_PROCESS?.trim() || DEFAULT_TAX_INVOICE,
  };
}
