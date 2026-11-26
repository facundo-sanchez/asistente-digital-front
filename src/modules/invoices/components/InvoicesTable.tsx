import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { InvoiceResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/**
 * Facturas como libro de cuentas: servicio (con número y período), vencimiento, importe y
 * el estado de su vencimiento. El servicio lleva al vencimiento, donde se paga.
 */
export function InvoicesTable({ invoices }: { invoices: InvoiceResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Factura
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Vence
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
              Importe
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Estado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {invoices.map((invoice) => {
            const detail = [invoice.invoiceNumber, invoice.billingPeriod].filter(Boolean).join(" · ");
            return (
              <Box component="tr" key={invoice.id}>
                <Box component="td" sx={ledgerCell}>
                  {invoice.obligationId ? (
                    <TextLink href={`/obligations/${invoice.obligationId}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                      {invoice.serviceName}
                    </TextLink>
                  ) : (
                    <Typography sx={{ fontWeight: 600 }}>{invoice.serviceName}</Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" className="tabular-nums">
                    {detail || "Sin número"}
                  </Typography>
                </Box>
                <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }} className="tabular-nums">
                  {formatDate(invoice.dueDate)}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                  {formatMoney(invoice.totalAmount, invoice.currency)}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                  {invoice.obligationStatus ? <ObligationStatus status={invoice.obligationStatus} /> : EMPTY}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
