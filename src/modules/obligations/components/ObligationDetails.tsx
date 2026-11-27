import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ObligationResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { DetailList } from "@/components/layout/DetailList";
import { formatDate, formatDay } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { OBLIGATION_TYPE_LABELS } from "@/lib/obligation-labels";
import type { PaymentTarget } from "@/lib/wallets";
import { PaymentCode } from "@/modules/invoices/components/PaymentCode";
import { ObligationStatus } from "./ObligationStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

function money(amount: number | null, currency: string | null): ReactNode {
  const text = formatMoney(amount, currency);
  return text ? <span className="tabular-nums">{text}</span> : EMPTY;
}

/** Datos de la obligación: estado, vencimiento, importes, servicio y notas. */
export function ObligationDetails({
  obligation,
  statementId,
  payment,
}: {
  obligation: ObligationResponse;
  statementId?: string;
  /** Código de pago de su factura y a dónde pagarla, si sigue sin pagar. */
  payment?: { code: string; target: PaymentTarget | null } | null;
}) {
  const rows: [string, ReactNode][] = [
    ["Estado", <ObligationStatus key="status" status={obligation.effectiveStatus} />],
    ["Vence", <span key="due" className="tabular-nums">{formatDate(obligation.dueDate)}</span>],
    ["Tipo", OBLIGATION_TYPE_LABELS[obligation.obligationType]],
    ["Servicio", obligation.serviceName ?? EMPTY],
    ...(obligation.invoiceId
      ? [["Factura", <TextLink key="invoice" href={`/invoices/${obligation.invoiceId}`}>Ver factura, código de pago y archivo</TextLink>] as [string, ReactNode]]
      : []),
    ...(payment
      ? [["Código de pago", <PaymentCode key="code" code={payment.code} payable target={payment.target} />] as [string, ReactNode]]
      : []),
    ...(obligation.loanId
      ? [["Préstamo", <TextLink key="loan" href={`/loans/${obligation.loanId}`}>Ver el préstamo y sus cuotas</TextLink>] as [string, ReactNode]]
      : []),
    ...(statementId
      ? [["Resumen", <TextLink key="statement" href={`/card-statements/${statementId}`}>Ver resumen de la tarjeta</TextLink>] as [string, ReactNode]]
      : []),
    ["Importe", money(obligation.amount, obligation.currency)],
    ["Pagado", money(obligation.paidAmount, obligation.currency)],
    ["Saldo", money(obligation.balance, obligation.currency)],
  ];
  if (obligation.cancelledAt) {
    rows.push(["Cancelada", `${formatDay(obligation.cancelledAt)}${obligation.cancelReason ? ` · ${obligation.cancelReason}` : ""}`]);
  }
  if (obligation.description) {
    rows.push(["Notas", <Box key="notes" component="span" sx={{ whiteSpace: "pre-line" }}>{obligation.description}</Box>]);
  }
  return <DetailList rows={rows} />;
}
