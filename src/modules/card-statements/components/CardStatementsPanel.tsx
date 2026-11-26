import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { CardResponse, CardStatementResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";

/** Resúmenes de la tarjeta (más nuevos primero) y el próximo cierre y vencimiento que informó el banco. */
export async function CardStatementsPanel({ card }: { card: CardResponse }) {
  const statements = (await serverGet<CardStatementResponse[]>(`/cards/${card.id}/statements`)) ?? [];
  const latest = statements.find((s) => s.status === "CONFIRMED");
  const next = latest && (latest.nextClosingDate || latest.nextDueDate)
    ? `Según el último resumen: próximo cierre ${formatDate(latest.nextClosingDate) ?? "sin informar"}, próximo vencimiento ${formatDate(latest.nextDueDate) ?? "sin informar"}.`
    : undefined;

  return (
    <Panel
      title="Resúmenes"
      description={next}
      action={
        card.active && (
          <ButtonLink href={`/cards/${card.id}/statements/new`} variant="contained" startIcon={<AddOutlined />}>
            Cargar resumen
          </ButtonLink>
        )
      }
    >
      {statements.length === 0 ? (
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no cargaste resúmenes de esta tarjeta. Al cargar uno se crean sus vencimientos en pesos y en dólares.
        </Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={ledgerTable}>
            <Box component="thead">
              <Box component="tr">
                <Box component="th" scope="col" sx={ledgerHeadCell}>
                  Vence
                </Box>
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
                  Pesos
                </Box>
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
                  Dólares
                </Box>
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
                  Estado
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {statements.map((statement) => (
                <Box component="tr" key={statement.id} sx={statement.status === "REJECTED" ? { color: "text.secondary" } : undefined}>
                  <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }} className="tabular-nums">
                    <TextLink href={`/card-statements/${statement.id}`} sx={{ fontWeight: 600, color: "inherit" }}>
                      {formatDate(statement.dueDate)}
                    </TextLink>
                  </Box>
                  <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                    {formatMoney(statement.totalAmount, statement.currency)}
                  </Box>
                  <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                    {statement.totalAmountUsd > 0 ? formatMoney(statement.totalAmountUsd, "USD") : "—"}
                  </Box>
                  <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                    {statement.status === "REJECTED" ? (
                      "Anulado"
                    ) : (
                      <Stack spacing={0.5}>
                        {statement.obligationStatus && <ObligationStatus status={statement.obligationStatus} />}
                        {statement.obligationUsdStatus && <ObligationStatus status={statement.obligationUsdStatus} />}
                      </Stack>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Panel>
  );
}
