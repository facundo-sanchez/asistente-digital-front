import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { PageResponse, RecurringRuleResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { ObligationForm } from "@/modules/obligations/components/ObligationForm";

export const metadata: Metadata = { title: "Editar repetición" };

export default async function EditRecurringRulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [rule, services] = await Promise.all([
    serverGet<RecurringRuleResponse>(`/recurring-rules/${id}`),
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  if (!rule) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar repetición" description={`${rule.title}. Los cambios valen para los próximos vencimientos; los ya creados no cambian.`} />
      <Panel title="Datos de la repetición">
        <ObligationForm rule={rule} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}
