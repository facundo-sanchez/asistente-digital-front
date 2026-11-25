import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import type { ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { DocumentUploadForm } from "@/modules/documents/components/DocumentUploadForm";

export const metadata: Metadata = { title: "Subir documento" };

/** ?serviceId=… (desde el detalle de un servicio) deja el documento asociado a ese servicio. */
export default async function NewDocumentPage({ searchParams }: { searchParams: SearchParams }) {
  const serviceId = firstParam((await searchParams).serviceId);
  // Un id inválido o de otro usuario se ignora: se sube sin servicio
  const service = serviceId && isUuid(serviceId) ? await serverGet<ServiceResponse>(`/services/${serviceId}`) : null;

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Subir documento" description="Facturas, comprobantes, pólizas y otros papeles importantes." />
      <Panel title="Archivo">
        <DocumentUploadForm service={service ? { id: service.id, name: service.name } : undefined} />
      </Panel>
    </Stack>
  );
}
