import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardStatementResponse, CardTransactionResponse } from "@/types/api";
import { PrintButton } from "@/components/common/PrintButton";
import { TextLink } from "@/components/common/TextLink";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { TransactionsTable } from "@/modules/card-transactions/components/TransactionsTable";

export const metadata: Metadata = { title: "Resumen para imprimir" };

/** El resumen en una hoja: datos, totales y movimientos. "Imprimir" deja elegir "Guardar como PDF". */
export default async function StatementPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [statement, transactions] = await Promise.all([
    serverGet<CardStatementResponse>(`/card-statements/${id}`),
    serverGet<CardTransactionResponse[]>(`/card-statements/${id}/transactions`),
  ]);
  if (!statement) notFound();

  const facts: [string, string | null][] = [
    ["Cierre", formatDate(statement.closingDate)],
    ["Vencimiento", formatDate(statement.dueDate)],
    ["Total en pesos", formatMoney(statement.totalAmount, "ARS")],
    ["Total en dólares", statement.totalAmountUsd ? formatMoney(statement.totalAmountUsd, "USD") : null],
    ["Pago mínimo", statement.minimumPayment !== null ? formatMoney(statement.minimumPayment, "ARS") : null],
    ["Próximo vencimiento", formatDate(statement.nextDueDate)],
  ];

  return (
    <Stack spacing={3} sx={{ maxWidth: 900 }}>
      <Box data-noprint sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
        <TextLink href={`/card-statements/${statement.id}`}>Volver al resumen</TextLink>
        <PrintButton />
      </Box>
      <Box>
        <Typography variant="h1" sx={{ fontSize: "1.5rem" }}>
          {statement.cardName}
        </Typography>
        <Typography color="text.secondary">Resumen que vence el {formatDate(statement.dueDate)}</Typography>
      </Box>
      <Box component="dl" sx={{ m: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)" } }}>
        {facts
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <Box key={label}>
              <Typography component="dt" variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography component="dd" sx={{ m: 0, fontWeight: 600 }} className="tabular-nums">
                {value}
              </Typography>
            </Box>
          ))}
      </Box>
      {transactions && transactions.length > 0 ? (
        <TransactionsTable transactions={transactions} editable={false} />
      ) : (
        <Typography color="text.secondary">Este resumen no tiene el detalle de consumos.</Typography>
      )}
    </Stack>
  );
}
