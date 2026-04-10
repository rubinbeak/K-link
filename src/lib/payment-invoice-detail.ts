import { buildInvoice, tryDecomposeVatInclusive } from "@/lib/invoice";

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
  reference: string;
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
    reference: base.bankInfo.reference,
    issuerName: issuer.name,
    issuerEmail: issuer.email,
    issuerPhone: issuer.phone || "—",
  };
}

export function renderInvoiceHtmlDocument(d: PaymentInvoiceDetailView): string {
  const rows = [
    ["Invoice 번호", d.invoiceNumber],
    ["발행일 (Invoice Date)", d.issuedAt.toLocaleDateString("ko-KR")],
    ["납부 기한 (Due Date)", d.dueDate.toLocaleDateString("ko-KR")],
    ["공급자", `${d.supplierName}${d.supplierBusinessRegNo ? ` (사업자등록번호 ${d.supplierBusinessRegNo})` : ""}`],
    ["공급자 주소", d.supplierAddress],
    ["고객사(브랜드)", d.clientCompanyName],
    ["고객 담당자", d.clientManagerLine],
    ["고객 이메일", d.clientEmail],
    ["고객 연락처", d.clientPhone],
    ["캠페인 ID", d.campaignId],
    ["캠페인명", d.campaignTitle],
    ["서비스 내용", d.serviceNarrative],
  ];

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><th style="text-align:left;border:1px solid #ccc;padding:8px;width:200px;background:#f8f8f8">${escapeHtml(k)}</th><td style="border:1px solid #ccc;padding:8px;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const moneyRows = `
    <tr>
      <th style="text-align:left;border:1px solid #ccc;padding:8px;background:#f8f8f8">품목</th>
      <th style="text-align:right;border:1px solid #ccc;padding:8px;background:#f8f8f8">단가 (KRW)</th>
      <th style="text-align:right;border:1px solid #ccc;padding:8px;background:#f8f8f8">수량</th>
      <th style="text-align:right;border:1px solid #ccc;padding:8px;background:#f8f8f8">금액 (KRW)</th>
    </tr>
    <tr>
      <td style="border:1px solid #ccc;padding:8px">${escapeHtml(d.lineDescription)}</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right">${d.unitPriceKrw.toLocaleString("ko-KR")}</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right">${d.quantity}</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right">${d.lineAmountKrw.toLocaleString("ko-KR")}</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:600">공급가액</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right">${d.subtotalKrw.toLocaleString("ko-KR")}</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:600">부가세 (10%)</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right">${d.vatKrw > 0 ? d.vatKrw.toLocaleString("ko-KR") : "—"}</td>
    </tr>
    <tr>
      <td colspan="3" style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:700">합계 (납부 금액)</td>
      <td style="border:1px solid #ccc;padding:8px;text-align:right;font-weight:700">${d.totalKrw.toLocaleString("ko-KR")}</td>
    </tr>
  `;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(d.invoiceNumber)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;max-width:880px;margin:24px auto;padding:0 16px">
  <h1 style="font-size:22px;margin:0 0 8px">INVOICE</h1>
  <p style="margin:0 0 20px;color:#444">${escapeHtml(d.vatNote)}</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:20px">${tableRows}</table>
  <h2 style="font-size:16px;margin:24px 0 8px">금액</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px">${moneyRows}</table>
  <h2 style="font-size:16px;margin:24px 0 8px">결제 방법</h2>
  <p style="margin:0 0 8px">${escapeHtml(d.paymentMethod)} — ${escapeHtml(d.bankName)} / ${escapeHtml(d.accountNumber)} / 예금주 ${escapeHtml(d.accountHolder)}</p>
  <p style="margin:0 0 20px"><strong>이체 시 참조(메모):</strong> ${escapeHtml(d.reference)}</p>
  <h2 style="font-size:16px;margin:24px 0 8px">K-LINK 담당자</h2>
  <p style="margin:0">이름: ${escapeHtml(d.issuerName)}</p>
  <p style="margin:0">이메일: ${escapeHtml(d.issuerEmail)}</p>
  <p style="margin:0">연락처: ${escapeHtml(d.issuerPhone)}</p>
</body>
</html>`;
}
