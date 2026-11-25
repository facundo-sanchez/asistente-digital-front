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
import { ServiceDetails } from "@/modules/services/components/ServiceDetails";

export const metadata: Metadata = { title: "Servicio" };

/** UUID con formato válido: otro texto en la URL no llega al backend. */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ServicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const service = await serverGet<ServiceResponse>(`/services/${id}`);
  if (!service) notFound();
  const justCreated = firstParam((await searchParams).created) === "1";

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/services" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Servicios
        </TextLink>
        <PageHeader title={service.name} description={service.providerName} />
      </Box>
      {justCreated && <Alert severity="success">Registramos el servicio. Ya podés asociarle facturas y vencimientos.</Alert>}
      <Panel title="Datos del servicio">
        <ServiceDetails service={service} />
      </Panel>
      <Panel title="Facturas y vencimientos">
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no hay facturas de este servicio. Cuando las cargues, vas a ver acá sus montos, vencimientos y pagos.
        </Typography>
      </Panel>
    </Stack>
  );
}
