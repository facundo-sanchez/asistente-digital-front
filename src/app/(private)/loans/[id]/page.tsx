import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { LoanResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { DetailList } from "@/components/layout/DetailList";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { CancelLoanAction } from "@/modules/loans/components/CancelLoanAction";
import { EditLoanAction } from "@/modules/loans/components/EditLoanAction";
import { LoanSchedule } from "@/modules/loans/components/LoanSchedule";
import { LoanStatusLabel } from "@/modules/loans/components/LoanStatusLabel";

export const metadata: Metadata = { title: "Préstamo" };

/** Ficha del préstamo: cuánto falta, cuotas pagadas, datos y cronograma. */
export default async function LoanPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const loan = await serverGet<LoanResponse>(`/loans/${id}`);
  if (!loan) notFound();
  const created = firstParam((await searchParams).created) === "1";
  const money = (value: number | null) => formatMoney(value, loan.currency) ?? "—";
  const rows: [string, ReactNode][] = [
    ["Entidad", loan.lender],
    ["Estado", <LoanStatusLabel key="status" status={loan.status} />],
    ["Número", loan.loanNumber ?? "—"],
    ["Referencia en los avisos", loan.shortReference ?? "—"],
    ["Monto pedido", money(loan.principal)],
    ["Tasa", loan.rateType ? `${loan.rateType === "FIXED" ? "Fija" : "Variable"}${loan.annualRate != null ? ` · TNA ${String(loan.annualRate).replace(".", ",")} %` : ""}` : "—"],
    ["Última cuota", formatDate(loan.lastDueDate) ?? "—"],
    ["Total pagado", money(loan.totalPaid)],
  ];
  if (loan.bankBalance != null) rows.push(["Saldo de capital (banco)", `${money(loan.bankBalance)} al ${formatDate(loan.bankBalanceDate)}`]);
  if (loan.contractDocumentId) rows.push(["Comprobante de alta", <TextLink key="contract" href={`/documents/${loan.contractDocumentId}`}>Ver comprobante</TextLink>]);
  if (loan.cancelReason) rows.push(["Cancelado", loan.cancelReason]);
  if (loan.notes) rows.push(["Notas", loan.notes]);

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <Box>
        <TextLink href="/loans" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Préstamos
        </TextLink>
        <PageHeader title={loan.name} description={loan.lender} action={
            loan.status === "ACTIVE" ? (
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                <ButtonLink href="/documents/new?type=LOAN_RECEIPT" variant="contained">
                  Subir comprobante de pago
                </ButtonLink>
                <EditLoanAction loan={loan} />
                <CancelLoanAction loanId={loan.id} />
              </Stack>
            ) : undefined
          } />
      </Box>
      {created && <Alert severity="success">Cargamos el préstamo y sus {loan.installmentsCount} cuotas como vencimientos.</Alert>}
      <Panel title="Cuánto falta">
        <Box sx={{ display: "grid", gap: 1 }}>
          <Typography className="tabular-nums" sx={{ fontSize: { xs: "1.75rem", sm: "2.25rem" }, fontWeight: 800, lineHeight: 1.1 }}>
            {loan.status === "ACTIVE" ? money(loan.remaining) : loan.status === "PAID" ? "Pagado" : "Cancelado"}
          </Typography>
          {loan.status === "ACTIVE" && (
            <Typography variant="body2" color="text.secondary">
              Suma de las cuotas que faltan (estimado hasta tener el importe real de cada una).
            </Typography>
          )}
          <Typography className="tabular-nums" sx={{ mt: 1 }}>
            {loan.paidInstallments} de {loan.installmentsCount} cuotas pagadas
            {loan.next ? ` · próxima el ${formatDate(loan.next.dueDate)}` : ""}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(loan.paidInstallments / loan.installmentsCount) * 100}
            aria-label={`${loan.paidInstallments} de ${loan.installmentsCount} cuotas pagadas`}
            sx={{ height: 8, borderRadius: 4, maxWidth: 480 }}
          />
        </Box>
      </Panel>
      <Panel title="Datos del préstamo">
        <DetailList rows={rows} />
      </Panel>
      <Panel title="Cuotas" description="Cada cuota es un vencimiento: tocala para pagarla o ver su comprobante.">
        <LoanSchedule loan={loan} />
      </Panel>
    </Stack>
  );
}
