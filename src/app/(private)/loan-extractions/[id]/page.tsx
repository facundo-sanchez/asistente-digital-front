import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import type { LoanReceiptReviewResponse, LoanResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { DetailList } from "@/components/layout/DetailList";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { LoanReceiptReviewForm } from "@/modules/loans/components/LoanReceiptReviewForm";

export const metadata: Metadata = { title: "Comprobante de pago de cuota" };

/** Revisión del comprobante de pago de una cuota leído con IA (módulo 13.3). */
export default async function LoanReceiptReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [review, loans] = await Promise.all([
    serverGet<LoanReceiptReviewResponse>(`/loan-extractions/receipt/${id}`),
    serverGet<LoanResponse[]>("/loans"),
  ]);
  if (!review) notFound();
  const r = review.receipt;
  const currency = r.currency ?? "ARS";
  const money = (value: number | null) => formatMoney(value, currency) ?? "—";
  const rows: [string, ReactNode][] = [
    ["Entidad", r.lender ?? "—"],
    ["Número de préstamo", r.loanNumber ?? "—"],
    ["Cuota", r.installmentNumber != null ? `${r.installmentNumber}${r.pendingInstallments != null ? ` de ${r.installmentNumber + r.pendingInstallments}` : ""}` : "—"],
    ["Vencimiento", formatDate(r.dueDate) ?? "—"],
    ["Pagada el", formatDate(r.paymentDate) ?? "—"],
    ["Importe", money(r.totalAmount)],
    ["Desglose", [r.capital != null && `Capital ${money(r.capital)}`, r.interest != null && `Intereses ${money(r.interest)}`, r.vat != null && `IVA ${money(r.vat)}`, r.stamps != null && `Sellados ${money(r.stamps)}`].filter(Boolean).join(" · ") || "—"],
    ["Saldo", r.newBalance != null ? `${money(r.previousBalance)} → ${money(r.newBalance)}` : "—"],
  ];

  return (
    <Stack spacing={4} sx={{ maxWidth: 860 }}>
      <PageHeader title="Comprobante de pago de cuota" description="Esto leímos del comprobante. Revisalo y registrá el pago." />
      {review.warnings.map((w) => (
        <Alert key={w} severity="warning">{w}</Alert>
      ))}
      <Panel title="Lo que leímos" action={<ButtonLink href={`/documents/${review.documentId}`} variant="outlined">Ver comprobante</ButtonLink>}>
        <DetailList rows={rows} />
      </Panel>
      {review.status === "PENDING" ? (
        <Panel title="Registrar el pago">
          <LoanReceiptReviewForm review={review} loans={loans ?? []} />
        </Panel>
      ) : (
        <Alert severity="info">Este comprobante ya se revisó.</Alert>
      )}
    </Stack>
  );
}
