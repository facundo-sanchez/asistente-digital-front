import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { PendingInstallmentResponse } from "@/types/api";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatMoney } from "@/lib/money";

const monthFormat = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" });

/** Compras en cuotas que no terminaron: cuota actual, lo que falta y cuándo termina (cierre estimado de la última). */
export function PendingInstallmentsTable({ items, cardNames }: { items: PendingInstallmentResponse[]; cardNames: Map<string, string> }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Compra
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Termina
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
              Falta pagar
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {items.map((i) => (
            <Box component="tr" key={i.id}>
              <Box component="td" sx={ledgerCell}>
                <Typography sx={{ fontWeight: 600 }}>{i.merchant}</Typography>
                <Typography variant="body2" color="text.secondary" className="tabular-nums">
                  Cuota {i.installmentNumber} de {i.installmentTotal} · {formatMoney(i.installmentAmount, i.currency)} por mes
                  {cardNames.get(i.cardId) ? ` · ${cardNames.get(i.cardId)}` : ""}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }}>
                {monthFormat.format(new Date(`${i.estimatedLastClosingDate}T00:00:00Z`))}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {formatMoney(i.remainingAmount, i.currency)}
                <Typography variant="body2" color="text.secondary">
                  {i.remainingInstallments} {i.remainingInstallments === 1 ? "cuota" : "cuotas"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
