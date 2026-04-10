import { buildInvoice, tryDecomposeVatInclusive } from "@/lib/invoice";

export type PaymentInvoiceDetailView = {
  invoiceNumber: string;
  issuedAt: Date;
  dueDate: Date;
  supplierName: string;
  supplierAddress: string;
  supplierBusinessRegNo: string;
  clientCompanyName: string;
  clientManagerLine: string;
  clientEmail: string;
  clientPhone: string;
  campaignId: string;
  campaignTitle: string;
  serviceNarrative: string;
  lineDescription: string;
  unitPriceKrw: number;
  quantity: number;
  lineAmountKrw: number;
  subtotalKrw: number;
  vatKrw: number;
  totalKrw: number;
  vatNote: string;
  paymentMethod: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  issuerName: string;
  issuerEmail: string;
  issuerPhone: string;
};

function supplierBlock() {
  return {
    name: process.env.INVOICE_SUPPLIER_NAME?.trim() || "K-LINK",
    address: process.env.INVOICE_SUPPLIER_ADDRESS?.trim() || "사업자 주소는 세금계산서 발행 시 안내 드립니다.",
    regNo: process.env.INVOICE_SUPPLIER_BUSINESS_REG_NO?.trim() || "",
  };
}

function issuerContact() {
  return {
    name: process.env.INVOICE_ISSUER_NAME?.trim() || "K-LINK 담당",
    email:
      process.env.INVOICE_ISSUER_EMAIL?.trim() ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ||
      "hello@k-link.kr",
    phone: process.env.INVOICE_ISSUER_PHONE?.trim() || "",
  };
}

export function buildPaymentInvoiceDetail(input: {
  payment: { id: string; amount: number; createdAt: Date };
  campaign: { id: string; title: string; description: string } | null;
  brand: {
    brandName: string | null;
    name: string | null;
    email: string;
    contactPhoneE164: string | null;
  };
  pricing: { headcount: number; unitPriceKrw: number } | null;
}): PaymentInvoiceDetailView {
  const base = buildInvoice({
    paymentId: input.payment.id,
    amount: Math.round(input.payment.amount),
    issuedAt: input.payment.createdAt,
    campaignTitle: input.campaign?.title,
    brandName: input.brand.brandName ?? input.brand.name,
  });

  const campaign = input.campaign;
  const campaignId = campaign?.id ?? "—";
  const campaignTitle = campaign?.title ?? base.campaignTitle;
  const serviceNarrative = campaign?.description?.trim() || "방문형 인플루언서 콘텐츠 캠페인 서비스";

  const headcount = Math.max(1, input.pricing?.headcount ?? 1);
  const split = tryDecomposeVatInclusive(Math.round(input.payment.amount));

  let subtotalKrw: number;
  let vatKrw: number;
  let vatNote: string;
  if (split) {
    subtotalKrw = split.subtotal;
    vatKrw = split.vat;
    vatNote = "합계 금액은 공급가액에 부가세(10%)를 가산한 금액입니다.";
  } else {
    subtotalKrw = Math.round(input.payment.amount);
    vatKrw = 0;
    vatNote =
      "등록 시점 기준 납부 예정 금액입니다. 부가세 포함·별도 여부는 최종 계약·세금계산서 기준으로 확정됩니다.";
  }

  const quantity = headcount;
  const unitPriceKrw =
    split && quantity > 0 ? Math.round(split.subtotal / quantity) : Math.round(subtotalKrw / quantity);
  const lineAmountKrw = split ? split.subtotal : subtotalKrw;

  const sup = supplierBlock();
  const issuer = issuerContact();
  const clientCompany = (input.brand.brandName ?? input.brand.name ?? "브랜드사").trim() || "브랜드사";
  const clientManager = (input.brand.name ?? "").trim() || "—";

  return {
    invoiceNumber: base.invoiceNumber,
    issuedAt: base.issuedAt,
    dueDate: base.dueDate,
    supplierName: sup.name,
    supplierAddress: sup.address,
    supplierBusinessRegNo: sup.regNo,
    clientCompanyName: clientCompany,
    clientManagerLine: clientManager,
    clientEmail: input.brand.email,
    clientPhone: input.brand.contactPhoneE164 ?? "—",
    campaignId,
    campaignTitle,
    serviceNarrative,
    lineDescription: `방문형 인플루언서 콘텐츠 캠페인 운영 (캠페인 ID: ${campaignId})`,
    unitPriceKrw,
    quantity,
    lineAmountKrw,
    subtotalKrw,
    vatKrw,
    totalKrw: Math.round(input.payment.amount),
    vatNote,
    paymentMethod: "무통장입금",
    bankName: base.bankInfo.bankName,
    accountNumber: base.bankInfo.accountNumber,
    accountHolder: base.bankInfo.accountHolder,
    issuerName: issuer.name,
    issuerEmail: issuer.email,
    issuerPhone: issuer.phone || "—",
  };
}
