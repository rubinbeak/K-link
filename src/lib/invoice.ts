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

/** 합계(원)가 공급가 + round(공급가×10%)인 경우에만 역산합니다. (퍼널 견적 등) */
export function tryDecomposeVatInclusive(totalWithVat: number): { subtotal: number; vat: number } | null {
  const total = Math.round(totalWithVat);
  const minS = Math.max(0, Math.floor(total * 0.9));
  for (let subtotal = total; subtotal >= minS; subtotal--) {
    const vat = Math.round(subtotal * 0.1);
    if (subtotal + vat === total) return { subtotal, vat };
  }
  return null;
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
      bankName: process.env.BANK_NAME ?? "IBK 기업은행",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "289-127559-04-029",
      accountHolder: process.env.BANK_ACCOUNT_HOLDER ?? "백은진",
      reference: invoiceNumber,
    },
  };
}
