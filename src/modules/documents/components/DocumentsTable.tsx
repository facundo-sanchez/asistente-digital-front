import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { DocumentResponse } from "@/types/api";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { TextLink } from "@/components/common/TextLink";
import { formatDay } from "@/lib/dates";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";
import { formatFileSize } from "../upload-rules";
import { ProcessingStatusLabel } from "./ProcessingStatusLabel";

/**
 * Documentos como libro de cuentas: documento (título y archivo), tipo, servicio,
 * tamaño y fecha de carga. En mobile: documento y fecha.
 */
export function DocumentsTable({ documents }: { documents: DocumentResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Documento
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Tipo
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Servicio
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly, textAlign: "right" }}>
              Tamaño
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Cargado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {documents.map((document) => (
            <Box component="tr" key={document.id}>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/documents/${document.id}`} sx={{ fontWeight: 600, color: "text.primary", overflowWrap: "anywhere" }}>
                  {document.title ?? document.originalFilename}
                </TextLink>
                {document.title && (
                  <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>
                    {document.originalFilename}
                  </Typography>
                )}
                {document.processingStatus !== "NOT_REQUIRED" && (
                  <Box sx={{ mt: 0.5 }}>
                    <ProcessingStatusLabel status={document.processingStatus} />
                  </Box>
                )}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                {DOCUMENT_TYPE_LABELS[document.documentType]}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                {document.serviceName ?? <Typography component="span" color="text.secondary">—</Typography>}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, textAlign: "right" }} className="tabular-nums">
                {formatFileSize(document.fileSize)}
              </Box>
              <Box component="td" sx={ledgerCell} className="tabular-nums">
                {formatDay(document.createdAt)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
