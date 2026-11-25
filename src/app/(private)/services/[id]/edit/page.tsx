import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { ServiceForm } from "@/modules/services/components/ServiceForm";
import { isUuid } from "@/lib/uuid";

export const metadata: Metadata = { title: "Editar servicio" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const service = await serverGet<ServiceResponse>(`/services/${id}`);
  if (!service) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar servicio" description={service.name} />
      <Panel title="Datos del servicio">
        <ServiceForm service={service} />
      </Panel>
    </Stack>
  );
}
