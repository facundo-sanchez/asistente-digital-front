import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { CardResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { CardsTable } from "@/modules/cards/components/CardsTable";

export const metadata: Metadata = { title: "Tarjetas" };

export default async function CardsPage() {
  const cards = (await serverGet<CardResponse[]>("/cards")) ?? [];
  const active = cards.filter((c) => c.active);
  const inactive = cards.filter((c) => !c.active);

  const newButton = (
    <ButtonLink href="/cards/new" variant="contained" startIcon={<AddOutlined />}>
      Nueva tarjeta
    </ButtonLink>
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <PageHeader title="Tarjetas" description="Tus tarjetas de crédito y sus resúmenes." action={newButton} />
      <Alert severity="info" variant="outlined">
        El cierre y el vencimiento los fija el banco cada mes: los cargás con cada resumen.
      </Alert>
      {active.length > 0 && (
        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
          <ButtonLink href="/cards/report" variant="outlined">
            Informe de consumos
          </ButtonLink>
          <ButtonLink href="/cards/installments" variant="outlined">
            Cuotas pendientes
          </ButtonLink>
          <ButtonLink href="/cards/rules" variant="text">
            Rubros por comercio
          </ButtonLink>
        </Stack>
      )}
      <Panel title="Tus tarjetas" description={`${active.length} ${active.length === 1 ? "activa" : "activas"}`}>
        {active.length > 0 ? (
          <CardsTable cards={active} />
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>Todavía no registraste tarjetas</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              Registrá tu tarjeta para cargar sus resúmenes y tener sus vencimientos en pesos y en dólares.
            </Typography>
            {newButton}
          </Box>
        )}
      </Panel>
      {inactive.length > 0 && (
        <Panel title="Dadas de baja">
          <CardsTable cards={inactive} />
        </Panel>
      )}
    </Stack>
  );
}
