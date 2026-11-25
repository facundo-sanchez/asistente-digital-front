import type { Metadata } from "next";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import type { DocumentResponse, PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import { toQueryString } from "@/lib/api/query-string";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { DocumentFilters } from "@/modules/documents/components/DocumentFilters";
import { DocumentsTable } from "@/modules/documents/components/DocumentsTable";
import { parseFilters, toListParams } from "@/modules/documents/document-list-filters";

export const metadata: Metadata = { title: "Documentos" };

export default async function DocumentsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const filters = parseFilters({
    query: firstParam(raw.query),
    documentType: firstParam(raw.documentType),
    serviceId: firstParam(raw.serviceId),
    page: firstParam(raw.page),
  });
  const [result, services] = await Promise.all([
    serverGet<PageResponse<DocumentResponse>>(`/documents${toQueryString(toListParams(filters))}`),
    // Para el filtro por servicio: todos los servicios del usuario, activos o no
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  const documents = result?.content ?? [];
  const hasFilters = !!filters.query || !!filters.documentType || !!filters.serviceId;
  const justUploaded = firstParam(raw.uploaded) === "1";

  const uploadButton = (
    <ButtonLink href="/documents/new" variant="contained" startIcon={<UploadFileOutlined />}>
      Subir documento
    </ButtonLink>
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title="Documentos" description="Facturas, comprobantes, pólizas y papeles importantes en un solo lugar." action={uploadButton} />
      {justUploaded && <Alert severity="success">Subimos el documento.</Alert>}
      <DocumentFilters filters={filters} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      <Panel
        title={hasFilters ? "Resultados" : "Tus documentos"}
        description={result ? `${result.totalElements} ${result.totalElements === 1 ? "documento" : "documentos"}` : undefined}
      >
        {documents.length > 0 ? (
          <>
            <DocumentsTable documents={documents} />
            <UrlPagination page={filters.page} totalPages={result?.totalPages ?? 0} />
          </>
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>
              {hasFilters ? "Ningún documento coincide con los filtros" : "Todavía no subiste documentos"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              {hasFilters
                ? "Probá con otra búsqueda, otro tipo u otro servicio."
                : "Guardá tus facturas, comprobantes de pago y pólizas para tenerlos a mano cuando los necesites."}
            </Typography>
            {hasFilters ? (
              <ButtonLink href="/documents" variant="outlined">
                Limpiar filtros
              </ButtonLink>
            ) : (
              uploadButton
            )}
          </Box>
        )}
      </Panel>
    </Stack>
  );
}
