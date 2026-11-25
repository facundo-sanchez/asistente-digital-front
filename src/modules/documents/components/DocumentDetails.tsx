import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import type { DocumentResponse } from "@/types/api";
import { DetailList } from "@/components/layout/DetailList";
import { formatDate, formatDay } from "@/lib/dates";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";
import { formatFileSize } from "../upload-rules";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/** Datos del documento: tipo, archivo, servicio, vencimiento, tamaño y fecha de carga. */
export function DocumentDetails({ document }: { document: DocumentResponse }) {
  const rows: [string, ReactNode][] = [
    ["Tipo", DOCUMENT_TYPE_LABELS[document.documentType]],
    ["Archivo", <span key="file" style={{ overflowWrap: "anywhere" }}>{document.originalFilename}</span>],
    ["Servicio", document.serviceName ?? EMPTY],
    ["Vence", formatDate(document.expiresOn) ?? EMPTY],
    ["Tamaño", <span key="size" className="tabular-nums">{formatFileSize(document.fileSize)}</span>],
    ["Cargado", <span key="created" className="tabular-nums">{formatDay(document.createdAt)}</span>],
  ];
  return <DetailList rows={rows} />;
}
