import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import type { PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { ObligationForm } from "@/modules/obligations/components/ObligationForm";

export const metadata: Metadata = { title: "Nuevo vencimiento" };

/** ?serviceId=… (desde el detalle de un servicio) arranca con ese servicio elegido. */
export default async function NewObligationPage({ searchParams }: { searchParams: SearchParams }) {
  const serviceId = firstParam((await searchParams).serviceId);
  // shortcut: hasta 100 servicios por usuario; con más, buscar en el backend al tipear
  const services = await serverGet<PageResponse<ServiceResponse>>("/services?size=100");
  // Un id desconocido o de otro usuario no está en la lista: se ignora
  const options = (services?.content ?? []).map(({ id, name }) => ({ id, name }));

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Nuevo vencimiento" description="VTV, impuestos, seguros, renovaciones o cualquier pago con fecha." />
      <Panel title="Datos del vencimiento">
        <ObligationForm services={options} defaultService={options.find((s) => s.id === serviceId)} />
      </Panel>
    </Stack>
  );
}
