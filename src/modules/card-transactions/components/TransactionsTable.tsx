import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { CardTransactionResponse } from "@/types/api";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { CategorySelect } from "./CategorySelect";

/**
 * Consumos como libro de cuentas: fecha, comercio, cuota, rubro e importe. Con editable, el rubro se puede cambiar
 * (en papel, en la versión para imprimir, va como texto).
 */
export function TransactionsTable({ transactions, editable = true }: { transactions: CardTransactionResponse[]; editable?: boolean }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Fecha
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Comercio
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Rubro
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
              Importe
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {transactions.map((t) => (
            <Box component="tr" key={t.id}>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }} className="tabular-nums">
                {formatDate(t.transactionDate)}
              </Box>
              <Box component="td" sx={ledgerCell}>
                <Typography sx={{ fontWeight: 600 }}>{t.merchantName ?? t.description}</Typography>
                <Typography variant="body2" color="text.secondary" className="tabular-nums">
                  {t.installmentTotal ? `Cuota ${t.installmentNumber} de ${t.installmentTotal}` : t.description}
                  <Box component="span" sx={{ display: { sm: "none" } }}>
                    {" · "}
                    {formatDate(t.transactionDate)}
                  </Box>
                </Typography>
              </Box>
              <Box component="td" sx={ledgerCell}>
                {editable ? <CategorySelect transaction={t} /> : SPENDING_CATEGORY_LABELS[t.category]}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {formatMoney(t.amount, t.currency)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
