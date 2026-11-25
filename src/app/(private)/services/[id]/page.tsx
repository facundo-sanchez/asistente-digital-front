import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { ServiceResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { ServiceDetails } from "@/modules/services/components/ServiceDetails";
import { ServiceStatusAction } from "@/modules/services/components/ServiceStatusAction";
import { ButtonLink } from "@/components/common/ButtonLink";
import { ServiceDocumentsPanel } from "@/modules/documents/components/ServiceDocumentsPanel";

export const metadata: Metadata = { title: "Servicio" };

export default async function ServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();

  const service = await serverGet<ServiceResponse>(`/services/${id}`);
  if (!service) notFound();
  const query = await searchParams;
  const notice = firstParam(query.created) === "1"
    ? "Registramos el servicio. Ya podés asociarle facturas y vencimientos."
    : firstParam(query.updated) === "1"
      ? "Guardamos los cambios."
      : firstParam(query.uploaded) === "1"
        ? "Subimos el documento."
        : null;

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/services" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Servicios
        </TextLink>
        <PageHeader
          title={service.name}
          description={service.providerName}
          action={
            <Stack direction="row" spacing={1.5}>
              <ButtonLink href={`/services/${service.id}/edit`} variant="contained">
                Editar
              </ButtonLink>
              <ServiceStatusAction service={service} />
            </Stack>
          }
        />
      </Box>
      {notice && <Alert severity="success">{notice}</Alert>}
      <Panel title="Datos del servicio">
        <ServiceDetails service={service} />
      </Panel>
      <ServiceDocumentsPanel serviceId={service.id} />
      <Panel title="Facturas y vencimientos">
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no hay facturas de este servicio. Cuando las cargues, vas a ver acá sus montos, vencimientos y pagos.
        </Typography>
      </Panel>
    </Stack>
  );
}
