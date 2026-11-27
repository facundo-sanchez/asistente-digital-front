import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { LoanResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

/** Préstamos en curso en el inicio: lo que falta por moneda y la próxima cuota de cada uno. No se muestra sin préstamos. */
export function LoansPanel({ loans }: { loans: LoanResponse[] }) {
  const active = loans.filter((l) => l.status === "ACTIVE");
  if (active.length === 0) return null;
  const totals = new Map<string, number>();
  for (const loan of active) totals.set(loan.currency, (totals.get(loan.currency) ?? 0) + Number(loan.remaining));

  return (
    <Panel title="Préstamos" action={<TextLink href="/loans">Ver todos</TextLink>}>
      <Typography className="tabular-nums" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
        {[...totals].map(([currency, total]) => formatMoney(total, currency)).join(" y ")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Te falta pagar (estimado)
      </Typography>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.25 }}>
        {active.map((loan) => (
          <Box component="li" key={loan.id} className="tabular-nums">
            <TextLink href={`/loans/${loan.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
              {loan.name}
            </TextLink>{" "}
            <Typography component="span" variant="body2" color="text.secondary">
              · {loan.paidInstallments}/{loan.installmentsCount}
              {loan.next ? ` · próxima el ${formatDate(loan.next.dueDate)}, ${formatMoney(loan.next.balance, loan.currency)}` : ""}
            </Typography>
          </Box>
        ))}
      </Box>
    </Panel>
  );
}
