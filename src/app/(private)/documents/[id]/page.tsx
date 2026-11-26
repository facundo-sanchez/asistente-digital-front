import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import type { AiAvailabilityResponse, DocumentResponse, ProcessingJobResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { DocumentDeleteAction } from "@/modules/documents/components/DocumentDeleteAction";
import { DocumentDetails } from "@/modules/documents/components/DocumentDetails";
import { DocumentProcessing } from "@/modules/documents/components/DocumentProcessing";
import { DocumentPreview } from "@/modules/documents/components/DocumentPreview";
import { documentFileUrl } from "@/modules/documents/file-url";

export const metadata: Metadata = { title: "Documento" };

export default async function DocumentPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: SearchParams }) {
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const document = await serverGet<DocumentResponse>(`/documents/${id}`);
  if (!document) notFound();
  const name = document.title ?? document.originalFilename;
  const [job, ai, extraction] = await Promise.all([
    // 404 = nunca se pidió leerlo con IA
    document.processingStatus === "NOT_REQUIRED" ? null : serverGet<ProcessingJobResponse>(`/documents/${id}/processing`),
    serverGet<AiAvailabilityResponse>("/documents/ai"),
    document.processingStatus === "REQUIRES_REVIEW" || document.processingStatus === "COMPLETED"
      ? serverGet<{ id: string }>(`/extractions?documentId=${id}`)
      : null,
  ]);
  const canProcess = !!ai?.available && ai.documentTypes.includes(document.documentType);
  const showProcessing = document.processingStatus !== "NOT_REQUIRED" || canProcess;
  const updated = firstParam((await searchParams).updated) === "1";

  return (
    <Stack spacing={4} sx={{ maxWidth: 1000 }}>
      <Box>
        <TextLink href="/documents" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}>
          <ArrowBackOutlined fontSize="small" />
          Documentos
        </TextLink>
        <PageHeader
          title={name}
          description={document.serviceName ?? undefined}
          action={
            <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap" }}>
              {/* Enlace común: la descarga la resuelve el navegador con el nombre original */}
              <Button href={documentFileUrl(document.id)} variant="contained" startIcon={<DownloadOutlined />}>
                Descargar
              </Button>
              <ButtonLink href={`/documents/${document.id}/edit`} variant="outlined">
                Editar
              </ButtonLink>
              <DocumentDeleteAction id={document.id} name={name} />
            </Stack>
          }
        />
      </Box>
      {updated && <Alert severity="success">Guardamos los cambios.</Alert>}
      {showProcessing && (
        <Panel title="Lectura con IA">
          <DocumentProcessing document={document} job={job} canProcess={canProcess} extractionId={extraction?.id ?? null} />
        </Panel>
      )}
      <Panel title="Vista previa">
        <DocumentPreview document={document} />
      </Panel>
      <Panel title="Datos del documento">
        <DocumentDetails document={document} />
      </Panel>
    </Stack>
  );
}
