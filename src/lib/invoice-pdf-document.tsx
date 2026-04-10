import React from "react";
import { Document, Font, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { PaymentInvoiceDetailView } from "@/lib/payment-invoice-detail";

const FONT_URL =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanskr/static/NotoSansKR-Regular.ttf";

let fontRegistered = false;
function ensureKoreanFont() {
  if (fontRegistered) return;
  Font.register({ family: "NotoSansKR", src: FONT_URL });
  fontRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "NotoSansKR",
    fontSize: 9,
    color: "#18181b",
  },
  title: { fontSize: 17, marginBottom: 14 },
  sectionTitle: { fontSize: 10, marginTop: 12, marginBottom: 6, color: "#3f3f46" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 6,
    alignItems: "flex-start",
  },
  cellLabel: { width: "30%", fontSize: 9, color: "#71717a", paddingRight: 8 },
  cellValue: { flex: 1, fontSize: 9, lineHeight: 1.45 },
  note: { fontSize: 8, color: "#71717a", marginTop: 8, lineHeight: 1.45 },
  contactLine: { fontSize: 9, marginTop: 2 },
});

function KvRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

export function InvoicePdfDocument({ detail }: { detail: PaymentInvoiceDetailView }) {
  ensureKoreanFont();

  const vatLine =
    detail.vatKrw > 0 ? `${detail.vatKrw.toLocaleString("ko-KR")}원` : "— (별도 안내)";

  return (
    <Document title={detail.invoiceNumber} author="K-LINK" subject="Invoice">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>INVOICE</Text>

        <Text style={styles.sectionTitle}>기본 정보</Text>
        <KvRow label="Invoice 번호" value={detail.invoiceNumber} />
        <KvRow label="발행일 (Invoice Date)" value={detail.issuedAt.toLocaleDateString("ko-KR")} />
        <KvRow label="납부 기한 (Due Date)" value={detail.dueDate.toLocaleDateString("ko-KR")} />

        <Text style={styles.sectionTitle}>공급자</Text>
        <KvRow
          label="회사"
          value={
            detail.supplierBusinessRegNo
              ? `${detail.supplierName} (사업자등록번호 ${detail.supplierBusinessRegNo})`
              : detail.supplierName
          }
        />
        <KvRow label="주소" value={detail.supplierAddress} />

        <Text style={styles.sectionTitle}>고객 (브랜드)</Text>
        <KvRow label="고객사" value={detail.clientCompanyName} />
        <KvRow label="담당자" value={detail.clientManagerLine} />
        <KvRow label="이메일" value={detail.clientEmail} />
        <KvRow label="연락처" value={detail.clientPhone} />

        <Text style={styles.sectionTitle}>서비스</Text>
        <KvRow label="캠페인 ID" value={detail.campaignId} />
        <KvRow label="캠페인명" value={detail.campaignTitle} />
        <View style={styles.row}>
          <Text style={styles.cellLabel}>제공 내용</Text>
          <Text style={styles.cellValue}>{detail.serviceNarrative}</Text>
        </View>

        <Text style={styles.sectionTitle}>금액</Text>
        <KvRow label="품목" value={detail.lineDescription} />
        <KvRow
          label="단가 / 수량"
          value={`${detail.unitPriceKrw.toLocaleString("ko-KR")}원 × ${detail.quantity}`}
        />
        <KvRow label="공급가액" value={`${detail.subtotalKrw.toLocaleString("ko-KR")}원`} />
        <KvRow label="부가세 (10%)" value={vatLine} />
        <KvRow label="합계 (납부 금액, VAT 포함)" value={`${detail.totalKrw.toLocaleString("ko-KR")}원`} />
        <Text style={styles.note}>{detail.vatNote}</Text>

        <Text style={styles.sectionTitle}>결제 방법 (무통장입금)</Text>
        <KvRow label="은행" value={detail.bankName} />
        <KvRow label="계좌번호" value={detail.accountNumber} />
        <KvRow label="예금주" value={detail.accountHolder} />

        <Text style={styles.sectionTitle}>K-LINK 담당</Text>
        <Text style={styles.contactLine}>이름: {detail.issuerName}</Text>
        <Text style={styles.contactLine}>이메일: {detail.issuerEmail}</Text>
        <Text style={styles.contactLine}>연락처: {detail.issuerPhone}</Text>
      </Page>
    </Document>
  );
}
