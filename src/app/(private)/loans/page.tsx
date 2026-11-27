import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { LoanResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { LoansTable } from "@/modules/loans/components/LoansTable";

export const metadata: Metadata = { title: "Préstamos" };

/** Lo que falta pagar por moneda, de los préstamos en curso. */
function remainingByCurrency(loans: LoanResponse[]): string {
  const totals = new Map<string, number>();
  for (const loan of loans.filter((l) => l.status === "ACTIVE")) {
    totals.set(loan.currency, (totals.get(loan.currency) ?? 0) + Number(loan.remaining));
  }
  return [...totals].map(([currency, total]) => formatMoney(total, currency)).join(" y ");
}

export default async function LoansPage() {
  const loans = (await serverGet<LoanResponse[]>("/loans")) ?? [];
  const newButton = (
    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
      <ButtonLink href="/documents/new?type=LOAN_CONTRACT" variant="outlined">
        Desde el comprobante
      </ButtonLink>
      <ButtonLink href="/loans/new" variant="contained" startIcon={<AddOutlined />}>
        Cargar préstamo
      </ButtonLink>
    </Stack>
  );
  const remaining = remainingByCurrency(loans);

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <PageHeader title="Préstamos" description="Los préstamos que tomaste: cada cuota es un vencimiento con su aviso." action={newButton} />
      <Panel title="Tus préstamos" description={remaining ? `Te falta pagar ${remaining} (estimado).` : undefined}>
        {loans.length > 0 ? (
          <LoansTable loans={loans} />
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>Todavía no cargaste préstamos</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              Cargá el préstamo con su cantidad de cuotas y la app crea cada cuota como un vencimiento: te avisa antes y ves cuánto te falta.
            </Typography>
            {newButton}
          </Box>
        )}
      </Panel>
    </Stack>
  );
}
