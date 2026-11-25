import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stack from "@mui/material/Stack";
import type { DocumentResponse, PageResponse, ServiceResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { DocumentForm } from "@/modules/documents/components/DocumentForm";

export const metadata: Metadata = { title: "Editar documento" };

export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const [document, services] = await Promise.all([
    serverGet<DocumentResponse>(`/documents/${id}`),
    // shortcut: hasta 100 servicios por usuario; con más, buscar en el backend al tipear
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  if (!document) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <PageHeader title="Editar documento" description={document.title ?? document.originalFilename} />
      <Panel title="Datos del documento">
        <DocumentForm document={document} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      </Panel>
    </Stack>
  );
}
