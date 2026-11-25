import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { ObligationResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { ServiceDocumentsPanel } from "@/modules/documents/components/ServiceDocumentsPanel";
import { ObligationCancelAction } from "@/modules/obligations/components/ObligationCancelAction";
import { ObligationDetails } from "@/modules/obligations/components/ObligationDetails";

export const metadata: Metadata = { title: "Vencimiento" };

export default async function ObligationPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const obligation = await serverGet<ObligationResponse>(`/obligations/${id}`);
  if (!obligation) notFound();
  const query = await searchParams;
  const notice = firstParam(query.created) === "1"
    ? "Registramos el vencimiento."
    : firstParam(query.updated) === "1"
      ? "Guardamos los cambios."
      : null;
  const editable = obligation.status !== "PAID" && obligation.status !== "CANCELLED";

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/obligations" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Vencimientos
        </TextLink>
        <PageHeader
          title={obligation.title}
          description={obligation.serviceName ?? undefined}
          action={
            editable && (
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                <ButtonLink href={`/obligations/${obligation.id}/edit`} variant="contained">
                  Editar
                </ButtonLink>
                <ObligationCancelAction id={obligation.id} title={obligation.title} />
              </Stack>
            )
          }
        />
      </Box>
      {notice && <Alert severity="success">{notice}</Alert>}
      <Panel title="Datos del vencimiento">
        <ObligationDetails obligation={obligation} />
      </Panel>
      {/* CU-005: los documentos asociados llegan por su servicio (facturas, pólizas) */}
      {obligation.serviceId && <ServiceDocumentsPanel serviceId={obligation.serviceId} />}
    </Stack>
  );
}
