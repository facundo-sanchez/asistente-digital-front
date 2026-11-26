import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { CardResponse, CardStatementResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { StatementForm } from "@/modules/card-statements/components/StatementForm";
import { loadDocumentOptions } from "@/modules/card-statements/load-documents";

export const metadata: Metadata = { title: "Editar resumen" };

export default async function EditStatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [statement, documents] = await Promise.all([serverGet<CardStatementResponse>(`/card-statements/${id}`), loadDocumentOptions()]);
  if (!statement) notFound();
  if (statement.status === "REJECTED") redirect(`/card-statements/${id}`);
  const card = await serverGet<CardResponse>(`/cards/${statement.cardId}`);
  if (!card) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar resumen" description={`${card.name}. Los cambios se copian a sus vencimientos.`} />
      <Panel title="Datos del resumen">
        <StatementForm card={card} statement={statement} documents={documents} />
      </Panel>
    </Stack>
  );
}
