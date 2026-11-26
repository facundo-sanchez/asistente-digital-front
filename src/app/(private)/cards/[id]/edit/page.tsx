import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { CardResponse, PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { CardForm } from "@/modules/cards/components/CardForm";

export const metadata: Metadata = { title: "Editar tarjeta" };

export default async function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [card, services] = await Promise.all([
    serverGet<CardResponse>(`/cards/${id}`),
    serverGet<PageResponse<ServiceResponse>>("/services?category=CREDIT_CARD&size=100"),
  ]);
  if (!card) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar tarjeta" description={card.name} />
      <Panel title="Datos de la tarjeta">
        <CardForm card={card} issuers={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}
