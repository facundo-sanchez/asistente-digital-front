import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { ObligationResponse, PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { ObligationForm } from "@/modules/obligations/components/ObligationForm";

export const metadata: Metadata = { title: "Editar vencimiento" };

export default async function EditObligationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [obligation, services] = await Promise.all([
    serverGet<ObligationResponse>(`/obligations/${id}`),
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  if (!obligation) notFound();
  // Pagadas y canceladas no se editan (el backend también lo impide)
  if (obligation.status === "PAID" || obligation.status === "CANCELLED") redirect(`/obligations/${id}`);

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar vencimiento" description={obligation.title} />
      <Panel title="Datos del vencimiento">
        <ObligationForm obligation={obligation} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}
