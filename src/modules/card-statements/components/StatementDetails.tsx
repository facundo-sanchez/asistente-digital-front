import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { CardStatementResponse, EffectiveObligationStatus } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { DetailList } from "@/components/layout/DetailList";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/** Importe con el estado de su vencimiento y el acceso a pagarlo. */
function total(amount: number, currency: string, obligationId: string | null, status: EffectiveObligationStatus | null): ReactNode {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
      <span className="tabular-nums">{formatMoney(amount, currency)}</span>
      {obligationId && status && (
        <>
          <ObligationStatus status={status} />
          <TextLink href={`/obligations/${obligationId}`}>Ver vencimiento y pagos</TextLink>
        </>
      )}
    </Box>
  );
}

/** Fechas y totales del resumen, como los informó el banco, con sus vencimientos. */
export function StatementDetails({ statement }: { statement: CardStatementResponse }) {
  const rows: [string, ReactNode][] = [
    ["Cierre", formatDate(statement.closingDate) ?? EMPTY],
    ["Vence", <span key="due" className="tabular-nums">{formatDate(statement.dueDate)}</span>],
    ["Total en pesos", total(statement.totalAmount, statement.currency, statement.obligationId, statement.obligationStatus)],
    ["Total en dólares", total(statement.totalAmountUsd, "USD", statement.obligationUsdId, statement.obligationUsdStatus)],
    ["Pago mínimo", formatMoney(statement.minimumPayment, statement.currency) ?? EMPTY],
    ["Próximo cierre", formatDate(statement.nextClosingDate) ?? EMPTY],
    ["Próximo vencimiento", formatDate(statement.nextDueDate) ?? EMPTY],
  ];
  return <DetailList rows={rows} />;
}
