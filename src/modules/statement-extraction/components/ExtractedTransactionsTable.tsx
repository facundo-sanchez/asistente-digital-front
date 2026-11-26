import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import type { MovementRow } from "./movement-row";

/**
 * Movimientos de un resumen: fecha, descripción, cuota n de m (con las que faltan) e importe.
 * Sirve para la propuesta de la IA y para los movimientos ya guardados.
 */
export function ExtractedTransactionsTable({ rows }: { rows: MovementRow[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Fecha
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Movimiento
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Cuota
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
              Importe
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row, i) => {
            const installment = row.installmentNumber && row.installmentTotal ? `${row.installmentNumber} de ${row.installmentTotal}` : null;
            const remaining = installment ? row.installmentTotal! - row.installmentNumber! : 0;
            return (
              <Box component="tr" key={i}>
                <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }} className="tabular-nums">
                  {formatDate(row.date) ?? "—"}
                </Box>
                <Box component="td" sx={ledgerCell}>
                  <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{row.merchant ?? row.description}</Typography>
                  {row.merchant && row.description && row.merchant !== row.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                      {row.description}
                    </Typography>
                  )}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }} className="tabular-nums">
                  {installment ?? "—"}
                  {installment && (
                    <Typography variant="body2" color="text.secondary">
                      {remaining === 0 ? "última cuota" : `quedan ${remaining}`}
                    </Typography>
                  )}
                </Box>
                <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                  {formatMoney(row.amount, row.currency === "USD" ? "USD" : "ARS") ?? "—"}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
