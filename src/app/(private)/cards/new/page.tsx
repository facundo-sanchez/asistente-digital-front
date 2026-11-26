import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import type { PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { CardForm } from "@/modules/cards/components/CardForm";

export const metadata: Metadata = { title: "Nueva tarjeta" };

/** ?serviceId=… (desde el servicio del banco) arranca con ese emisor elegido. */
export default async function NewCardPage({ searchParams }: { searchParams: SearchParams }) {
  const serviceId = firstParam((await searchParams).serviceId);
  const services = await serverGet<PageResponse<ServiceResponse>>("/services?category=CREDIT_CARD&size=100");
  const issuers = (services?.content ?? []).map(({ id, name }) => ({ id, name }));

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Nueva tarjeta" description="Después vas a poder cargar sus resúmenes." />
      <Panel title="Datos de la tarjeta">
        <CardForm issuers={issuers} defaultIssuer={issuers.find((s) => s.id === serviceId)} />
      </Panel>
    </Stack>
  );
}
