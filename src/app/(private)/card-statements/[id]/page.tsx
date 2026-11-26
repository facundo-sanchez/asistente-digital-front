import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { CardStatementResponse, CardTransactionResponse, DocumentResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatDate } from "@/lib/dates";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { StatementDetails } from "@/modules/card-statements/components/StatementDetails";
import { StatementRejectAction } from "@/modules/card-statements/components/StatementRejectAction";
import { DocumentPreview } from "@/modules/documents/components/DocumentPreview";
import { TransactionsTable } from "@/modules/card-transactions/components/TransactionsTable";
import { withBasePath } from "@/lib/config";
import Button from "@mui/material/Button";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";

export const metadata: Metadata = { title: "Resumen de tarjeta" };

const PAID_STATES = ["PAID", "PARTIALLY_PAID"];

export default async function StatementPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const statement = await serverGet<CardStatementResponse>(`/card-statements/${id}`);
  if (!statement) notFound();
  const [document, transactions] = await Promise.all([
    statement.documentId ? serverGet<DocumentResponse>(`/documents/${statement.documentId}`) : null,
    serverGet<CardTransactionResponse[]>(`/card-statements/${statement.id}/transactions`),
  ]);
  const query = await searchParams;
  const notice =
    firstParam(query.created) === "1"
      ? "Cargamos el resumen y creamos sus vencimientos."
      : firstParam(query.updated) === "1"
        ? "Guardamos los cambios. Sus vencimientos quedaron actualizados."
        : null;
  const rejected = statement.status === "REJECTED";
  // Con pagos en sus vencimientos no se edita ni anula (el backend también lo impide)
  const locked = [statement.obligationStatus, statement.obligationUsdStatus].some((s) => s !== null && PAID_STATES.includes(s));

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink
          href={`/cards/${statement.cardId}`}
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}
        >
          <ArrowBackOutlined fontSize="small" />
          {statement.cardName}
        </TextLink>
        <PageHeader
          title={`Resumen que vence el ${formatDate(statement.dueDate)}`}
          description={rejected ? "Anulado" : (statement.cardName ?? undefined)}
          action={
            !rejected &&
            !locked && (
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                <ButtonLink href={`/card-statements/${statement.id}/edit`} variant="outlined">
                  Editar
                </ButtonLink>
                <StatementRejectAction id={statement.id} />
              </Stack>
            )
          }
        />
      </Box>
      {notice && <Alert severity="success">{notice}</Alert>}
      {rejected && <Alert severity="info">Este resumen está anulado y sus vencimientos, cancelados.</Alert>}
      {locked && !rejected && (
        <Alert severity="info">Sus vencimientos tienen pagos: para corregirlo o anularlo, primero anulá los pagos.</Alert>
      )}
      <Panel title="Datos del resumen">
        <StatementDetails statement={statement} />
      </Panel>
      {transactions && transactions.length > 0 && (
        <Panel
          title="Movimientos"
          description={`${transactions.length} movimientos. Si un rubro no es el correcto, cambialo y elegí si se aplica siempre a ese comercio.`}
          action={
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              {/* Navegación completa: la descarga la resuelve el BFF */}
              <Button
                size="small"
                startIcon={<DownloadOutlined />}
                href={withBasePath(`/api/backend/card-statements/${statement.id}/export.xlsx`)}
              >
                Excel
              </Button>
              <ButtonLink size="small" href={`/card-statements/${statement.id}/print`}>
                Imprimir / PDF
              </ButtonLink>
            </Stack>
          }
        >
          <TransactionsTable transactions={transactions} />
        </Panel>
      )}
      {transactions && transactions.length === 0 && !rejected && (
        <Alert
          severity="info"
          action={
            <ButtonLink href="/documents/new?type=CARD_STATEMENT" color="inherit" size="small">
              Cargar el PDF
            </ButtonLink>
          }
        >
          Este resumen no tiene el detalle de consumos (por ejemplo, llegó por email solo con los totales). Subí el PDF del resumen con
          «Leer con IA» y al confirmarlo se le suman los movimientos.
        </Alert>
      )}
      {document && (
        <Panel
          title="Archivo del resumen"
          action={
            <ButtonLink href={`/documents/${document.id}`} variant="outlined">
              Ver documento
            </ButtonLink>
          }
        >
          <DocumentPreview document={document} />
        </Panel>
      )}
    </Stack>
  );
}
