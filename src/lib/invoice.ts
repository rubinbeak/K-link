import { addDays, format } from "date-fns";

type InvoiceInput = {
  paymentId: string;
  amount: number;
  issuedAt: Date;
  campaignTitle?: string | null;
  brandName?: string | null;
};

export function toInvoiceNumber(paymentId: string, issuedAt: Date) {
  const datePart = format(issuedAt, "yyyyMMdd");
  return `KL-INV-${datePart}-${paymentId.slice(-6).toUpperCase()}`;
}

export function buildInvoice(input: InvoiceInput) {
  const invoiceNumber = toInvoiceNumber(input.paymentId, input.issuedAt);
  const dueDate = addDays(input.issuedAt, 3);

  return {
    invoiceNumber,
    issuedAt: input.issuedAt,
    dueDate,
    campaignTitle: input.campaignTitle ?? "VISIT 콘텐츠 캠페인",
    brandName: input.brandName ?? "브랜드사",
    amount: input.amount,
    currency: "KRW" as const,
    paymentMethod: "무통장입금" as const,
    bankInfo: {
      bankName: process.env.BANK_NAME ?? "국민은행",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "000000-00-000000",
      accountHolder: process.env.BANK_ACCOUNT_HOLDER ?? "K-LINK",
      reference: invoiceNumber,
    },
  };
}
