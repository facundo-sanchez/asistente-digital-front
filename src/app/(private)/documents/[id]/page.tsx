import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import type { DocumentResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { DocumentDetails } from "@/modules/documents/components/DocumentDetails";
import { DocumentPreview } from "@/modules/documents/components/DocumentPreview";
import { documentFileUrl } from "@/modules/documents/file-url";

export const metadata: Metadata = { title: "Documento" };

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const document = await serverGet<DocumentResponse>(`/documents/${id}`);
  if (!document) notFound();

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <Box>
        <TextLink href="/documents" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Documentos
        </TextLink>
        <PageHeader
          title={document.title ?? document.originalFilename}
          description={document.serviceName ?? undefined}
          action={
            // Enlace común: la descarga la resuelve el navegador con el nombre original
            <Button href={documentFileUrl(document.id)} variant="contained" startIcon={<DownloadOutlined />}>
              Descargar
            </Button>
          }
        />
      </Box>
      <Panel title="Vista previa">
        <DocumentPreview document={document} />
      </Panel>
      <Panel title="Datos del documento">
        <DocumentDetails document={document} />
      </Panel>
    </Stack>
  );
}
