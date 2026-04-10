import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import type { PaymentInvoiceDetailView } from "@/lib/payment-invoice-detail";
import { InvoicePdfDocument } from "@/lib/invoice-pdf-document";

export async function renderPaymentInvoicePdf(detail: PaymentInvoiceDetailView): Promise<Buffer> {
  /* InvoicePdfDocument 루트가 <Document>인데, 래퍼 FC 타입과 renderToBuffer 제네릭이 맞지 않아 단언합니다. */
  return renderToBuffer(React.createElement(InvoicePdfDocument, { detail }) as never);
}
