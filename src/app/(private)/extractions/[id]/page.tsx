import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { CardResponse, StatementReviewResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { ExtractedTransactionsTable } from "@/modules/statement-extraction/components/ExtractedTransactionsTable";
import { StatementReviewForm } from "@/modules/statement-extraction/components/StatementReviewForm";

export const metadata: Metadata = { title: "Revisar resumen" };

export default async function ReviewStatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [review, cards] = await Promise.all([
    serverGet<StatementReviewResponse>(`/extractions/${id}`),
    serverGet<CardResponse[]>("/cards?active=true"),
  ]);
  if (!review) notFound();
  const transactions = review.statement.transactions ?? [];
  const pending = review.status === "PENDING";

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <Box>
        <TextLink href={`/documents/${review.documentId}`} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Documento
        </TextLink>
        <PageHeader
          title="Revisar resumen leído con IA"
          description={`${review.statement.bank ?? "Resumen de tarjeta"}. Revisá los datos: nada se guarda hasta que confirmes.`}
        />
      </Box>

      {pending ? (
        <Panel title="Datos del resumen">
          <StatementReviewForm review={review} cards={(cards ?? []).map(({ id, name }) => ({ id, name }))} />
        </Panel>
      ) : (
        <Alert severity="info" action={review.statementId && <ButtonLink href={`/card-statements/${review.statementId}`} size="small">Ver resumen</ButtonLink>}>
          {review.status === "REJECTED" ? "Esta propuesta fue descartada." : "Esta propuesta ya se confirmó."}
        </Alert>
      )}

      <Panel
        title="Movimientos leídos"
        description={`${transactions.length} movimientos · suman ${formatMoney(review.transactionsTotal, "ARS")}${
          review.transactionsTotalUsd !== 0 ? ` y ${formatMoney(review.transactionsTotalUsd, "USD")}` : ""
        } (pagos incluidos, con signo)`}
      >
        {transactions.length > 0 ? (
          <ExtractedTransactionsTable rows={transactions} />
        ) : (
          <Typography color="text.secondary">La IA no encontró movimientos en el archivo.</Typography>
        )}
      </Panel>
    </Stack>
  );
}
