import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { CardResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { CARD_BRAND_LABELS } from "@/lib/card-brands";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { CardStatementsPanel } from "@/modules/card-statements/components/CardStatementsPanel";
import { CardDetails } from "@/modules/cards/components/CardDetails";
import { CardStatusAction } from "@/modules/cards/components/CardStatusAction";

export const metadata: Metadata = { title: "Tarjeta" };

export default async function CardPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const card = await serverGet<CardResponse>(`/cards/${id}`);
  if (!card) notFound();
  const query = await searchParams;
  const notice = firstParam(query.created) === "1"
    ? "Registramos la tarjeta. Ya podés cargar sus resúmenes."
    : firstParam(query.updated) === "1"
      ? "Guardamos los cambios."
      : null;

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/cards" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Tarjetas
        </TextLink>
        <PageHeader
          title={card.name}
          description={`${CARD_BRAND_LABELS[card.brand]}${card.lastFour ? ` terminada en ${card.lastFour}` : ""} · ${card.serviceName}`}
          action={
            <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap", alignItems: "flex-start" }}>
              <ButtonLink href={`/cards/${card.id}/edit`} variant="outlined">
                Editar
              </ButtonLink>
              <CardStatusAction id={card.id} active={card.active} />
            </Stack>
          }
        />
      </Box>
      {notice && <Alert severity="success">{notice}</Alert>}
      <CardStatementsPanel card={card} />
      <Panel title="Datos de la tarjeta">
        <CardDetails card={card} />
      </Panel>
    </Stack>
  );
}
