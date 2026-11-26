import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { PaymentResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable, visuallyHidden } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-methods";
import { serverGet } from "@/lib/server/server-get";
import { PaymentActions } from "./PaymentActions";
import type { PaymentsPanelProps } from "./payments-panel-props";

/** Historial de pagos de la obligación: vigentes y anulados (tachados, con su motivo). */
export async function PaymentsPanel({ obligation, receipts }: PaymentsPanelProps) {
  const payments = (await serverGet<PaymentResponse[]>(`/obligations/${obligation.id}/payments`)) ?? [];
  const receiptNames = new Map(receipts.map((r) => [r.id, r.name]));

  return (
    <Panel title="Pagos" description={payments.length > 0 ? undefined : "Todavía no registraste pagos."}>
      {payments.length > 0 && (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={ledgerTable}>
            <Box component="thead">
              <Box component="tr">
                <Box component="th" scope="col" sx={ledgerHeadCell}>
                  Fecha
                </Box>
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
                  Importe
                </Box>
                <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
                  Medio y comprobante
                </Box>
                <Box component="th" scope="col" sx={ledgerHeadCell}>
                  <Box component="span" sx={visuallyHidden}>
                    Acciones
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box component="tbody">
              {payments.map((payment) => (
                <Box component="tr" key={payment.id} sx={payment.voided ? { color: "text.secondary" } : undefined}>
                  <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }} className="tabular-nums">
                    {formatDate(payment.paymentDate)}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      ...ledgerCell,
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                    className="tabular-nums"
                  >
                    <Box component={payment.voided ? "s" : "span"}>{formatMoney(payment.amount, payment.currency)}</Box>
                    {payment.voided && (
                      <Typography variant="body2" color="text.secondary">
                        Anulado: {payment.voidReason}
                      </Typography>
                    )}
                  </Box>
                  <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                    {PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                    {payment.receiptDocumentId && (
                      <Typography variant="body2">
                        <TextLink href={`/documents/${payment.receiptDocumentId}`}>
                          {receiptNames.get(payment.receiptDocumentId) ?? "Ver comprobante"}
                        </TextLink>
                      </Typography>
                    )}
                    {payment.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                        {payment.notes}
                      </Typography>
                    )}
                  </Box>
                  <Box component="td" sx={ledgerCell}>
                    {!payment.voided && <PaymentActions payment={payment} obligation={obligation} receipts={receipts} />}
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
