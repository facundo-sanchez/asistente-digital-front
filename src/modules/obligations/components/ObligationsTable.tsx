import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ObligationResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { OBLIGATION_TYPE_LABELS } from "@/lib/obligation-labels";
import { ObligationStatus } from "./ObligationStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/**
 * Vencimientos como libro de cuentas: vencimiento, obligación (título y tipo), servicio,
 * importe, saldo y estado. En mobile: vencimiento, obligación y estado.
 */
export function ObligationsTable({ obligations }: { obligations: ObligationResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Vence
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Obligación
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Servicio
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly, textAlign: "right" }}>
              Importe
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly, textAlign: "right" }}>
              Saldo
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Estado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {obligations.map((obligation) => (
            <Box component="tr" key={obligation.id}>
              <Box component="td" sx={{ ...ledgerCell, whiteSpace: "nowrap" }} className="tabular-nums">
                {formatDate(obligation.dueDate)}
              </Box>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/obligations/${obligation.id}`} sx={{ fontWeight: 600, color: "text.primary", overflowWrap: "anywhere" }}>
                  {obligation.title}
                </TextLink>
                <Typography variant="body2" color="text.secondary">
                  {OBLIGATION_TYPE_LABELS[obligation.obligationType]}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                {obligation.serviceName ?? EMPTY}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {formatMoney(obligation.amount, obligation.currency) ?? EMPTY}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {formatMoney(obligation.balance, obligation.currency) ?? EMPTY}
              </Box>
              <Box component="td" sx={ledgerCell}>
                <ObligationStatus status={obligation.effectiveStatus} />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
