import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import type { DocumentResponse, PageResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { DocumentsTable } from "./DocumentsTable";

const LIMIT = 10;

/** Últimos documentos de un servicio, con acceso a subir uno ya asociado. */
export async function ServiceDocumentsPanel({ serviceId }: { serviceId: string }) {
  const result = await serverGet<PageResponse<DocumentResponse>>(`/documents?serviceId=${serviceId}&size=${LIMIT}`);
  const documents = result?.content ?? [];
  const total = result?.totalElements ?? 0;

  return (
    <Panel
      title="Documentos"
      description={total > 0 ? `${total} ${total === 1 ? "documento" : "documentos"}` : undefined}
      action={
        <ButtonLink href={`/documents/new?serviceId=${serviceId}`} variant="outlined" startIcon={<UploadFileOutlined />}>
          Subir documento
        </ButtonLink>
      }
    >
      {documents.length > 0 ? (
        <Stack spacing={2}>
          <DocumentsTable documents={documents} />
          {total > LIMIT && (
            <TextLink href={`/documents?serviceId=${serviceId}`}>Ver los {total} documentos</TextLink>
          )}
        </Stack>
      ) : (
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no hay documentos de este servicio. Subí sus facturas o contratos para tenerlos a mano.
        </Typography>
      )}
    </Panel>
  );
}
