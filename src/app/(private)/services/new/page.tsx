import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import type { ProviderResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { isUuid } from "@/lib/uuid";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { ServiceForm } from "@/modules/services/components/ServiceForm";

export const metadata: Metadata = { title: "Agregar servicio" };

/** ?providerId=&customerReference=&next= llegan desde la revisión de una factura que vino por email. */
export default async function NewServicePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const providerId = firstParam(params.providerId);
  const provider = providerId && isUuid(providerId) ? await serverGet<ProviderResponse>(`/providers/${providerId}`) : null;
  const preset = provider ? { provider, customerReference: firstParam(params.customerReference) ?? "" } : undefined;

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Agregar servicio" description="Registrá un servicio para seguir sus facturas y vencimientos." />
      <Panel title="Datos del servicio">
        <ServiceForm preset={preset} next={firstParam(params.next)} />
      </Panel>
    </Stack>
  );
}
