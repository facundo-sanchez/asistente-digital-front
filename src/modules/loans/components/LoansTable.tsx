import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import type { LoanResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { LoanStatusLabel } from "./LoanStatusLabel";

/** Préstamos: entidad, cuotas pagadas de N, lo que falta y la próxima cuota. */
export function LoansTable({ loans }: { loans: LoanResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>Préstamo</Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>Cuotas</Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>Falta</Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>Próxima</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {loans.map((loan) => (
            <Box component="tr" key={loan.id}>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/loans/${loan.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                  {loan.name}
                </TextLink>
                <Typography variant="body2" color="text.secondary">
                  {loan.lender} · <LoanStatusLabel status={loan.status} />
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, minWidth: 120 }} className="tabular-nums">
                {loan.paidInstallments} de {loan.installmentsCount}
                <LinearProgress
                  variant="determinate"
                  value={(loan.paidInstallments / loan.installmentsCount) * 100}
                  aria-hidden
                  sx={{ mt: 0.75, height: 4, borderRadius: 2 }}
                />
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }} className="tabular-nums">
                {loan.status === "ACTIVE" ? formatMoney(loan.remaining, loan.currency) : "—"}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }} className="tabular-nums">
                {loan.next ? `${formatDate(loan.next.dueDate)} · ${formatMoney(loan.next.balance, loan.currency)}` : "—"}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
