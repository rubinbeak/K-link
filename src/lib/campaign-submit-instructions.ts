export type CampaignSubmitInstructions = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  /** 입금 확인 이후 브랜드와의 소통 방식 */
  postPaymentContact: string;
  /** 세금계산서·증빙 발급 절차 */
  taxInvoiceProcess: string;
};

const DEFAULT_POST_PAYMENT =
  "입금이 확인되면, 등록하신 연락처를 기준으로 담당자가 카카오톡 비즈니스 채널 또는 이메일로 먼저 연락드립니다.";

const DEFAULT_TAX_INVOICE =
  "세금계산서(또는 필요 시 거래 명세)는 발행 후 카카오톡 비즈니스 채널 또는 이메일로 보내드립니다.";

/**
 * 캠페인 제출·완료 화면 안내 문구. 계좌는 `invoice.ts`의 BANK_* 환경 변수와 동일합니다.
 * BRAND_POST_PAYMENT_CONTACT, BRAND_TAX_INVOICE_PROCESS 로 덮어쓸 수 있습니다.
 */
export function getCampaignSubmitInstructions(): CampaignSubmitInstructions {
  return {
    bankName: process.env.BANK_NAME ?? "IBK 기업은행",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "289-127559-04-029",
    accountHolder: process.env.BANK_ACCOUNT_HOLDER ?? "백은진",
    postPaymentContact: process.env.BRAND_POST_PAYMENT_CONTACT?.trim() || DEFAULT_POST_PAYMENT,
    taxInvoiceProcess: process.env.BRAND_TAX_INVOICE_PROCESS?.trim() || DEFAULT_TAX_INVOICE,
  };
}
