import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { CardResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { CardsTable } from "./CardsTable";

/** Tarjetas de un banco o emisor (servicio de la categoría Tarjetas). */
export async function ServiceCardsPanel({ serviceId }: { serviceId: string }) {
  // shortcut: filtra en el front; un usuario tiene pocas tarjetas
  const cards = ((await serverGet<CardResponse[]>("/cards")) ?? []).filter((c) => c.serviceId === serviceId);

  return (
    <Panel
      title="Tarjetas"
      action={
        <ButtonLink href={`/cards/new?serviceId=${serviceId}`} variant="outlined" startIcon={<AddOutlined />}>
          Nueva tarjeta
        </ButtonLink>
      }
    >
      {cards.length > 0 ? (
        <CardsTable cards={cards} />
      ) : (
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no registraste tarjetas de este banco.
        </Typography>
      )}
    </Panel>
  );
}
