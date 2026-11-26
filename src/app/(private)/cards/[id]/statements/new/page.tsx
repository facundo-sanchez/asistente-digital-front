import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { CardResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { StatementForm } from "@/modules/card-statements/components/StatementForm";
import { loadDocumentOptions } from "@/modules/card-statements/load-documents";

export const metadata: Metadata = { title: "Cargar resumen" };

export default async function NewStatementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [card, documents] = await Promise.all([serverGet<CardResponse>(`/cards/${id}`), loadDocumentOptions()]);
  if (!card) notFound();
  // Una tarjeta dada de baja no recibe resúmenes nuevos (el backend también lo impide)
  if (!card.active) redirect(`/cards/${id}`);

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Cargar resumen" description={`${card.name}. Se crean sus vencimientos en pesos y en dólares.`} />
      <Panel title="Datos del resumen">
        <StatementForm card={card} documents={documents} />
      </Panel>
    </Stack>
  );
}
