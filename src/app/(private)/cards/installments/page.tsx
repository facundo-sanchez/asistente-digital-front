import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardResponse, PendingInstallmentsResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { PendingInstallmentsTable } from "@/modules/card-transactions/components/PendingInstallmentsTable";

export const metadata: Metadata = { title: "Cuotas pendientes" };

export default async function PendingInstallmentsPage() {
  const [pending, cards] = await Promise.all([
    serverGet<PendingInstallmentsResponse>("/cards/installments/pending"),
    serverGet<CardResponse[]>("/cards"),
  ]);
  const items = pending?.items ?? [];
  const cardNames = new Map((cards ?? []).map((c) => [c.id, c.name]));

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/cards" sx={{ color: "text.secondary" }}>
          Tarjetas
        </TextLink>
        <PageHeader
          title="Cuotas pendientes"
          description="Las compras en cuotas que todavía no terminaste de pagar, según tu último resumen."
        />
      </Box>
      {pending && pending.totals.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {pending.totals.map((t) => (
            <Box key={t.currency}>
              <Typography variant="body2" color="text.secondary">
                Falta pagar {t.currency === "ARS" ? "en pesos" : `en ${t.currency}`}
              </Typography>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 600 }} className="tabular-nums">
                {formatMoney(t.total, t.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t.count} {t.count === 1 ? "compra" : "compras"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Panel title="Compras en cuotas">
        {items.length === 0 ? (
          <Typography color="text.secondary">No tenés cuotas pendientes en los resúmenes que cargaste.</Typography>
        ) : (
          <PendingInstallmentsTable items={items} cardNames={cardNames} />
        )}
      </Panel>
    </Stack>
  );
}
