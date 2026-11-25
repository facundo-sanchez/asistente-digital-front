import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import type { PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { ObligationForm } from "@/modules/obligations/components/ObligationForm";

export const metadata: Metadata = { title: "Nuevo vencimiento" };

export default async function NewObligationPage() {
  // shortcut: hasta 100 servicios por usuario; con más, buscar en el backend al tipear
  const services = await serverGet<PageResponse<ServiceResponse>>("/services?size=100");

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Nuevo vencimiento" description="VTV, impuestos, seguros, renovaciones o cualquier pago con fecha." />
      <Panel title="Datos del vencimiento">
        <ObligationForm services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}
