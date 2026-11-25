/**
 * Filtros del listado de documentos tal como viven en la URL de /documents
 * (?query=&documentType=&serviceId=&page=). page en la URL empieza en 1; en la API, en 0.
 */
import { DOCUMENT_TYPES, type DocumentType } from "@/types/api";
import { isUuid } from "@/lib/uuid";
import type { DocumentUrlFilters } from "./document-url-filters";

export const PAGE_SIZE = 20;

function isDocumentType(value: string | undefined): value is DocumentType {
  return !!value && (DOCUMENT_TYPES as readonly string[]).includes(value);
}

/** Lee los filtros de la URL; los valores desconocidos se ignoran. */
export function parseFilters(params: Record<string, string | undefined>): DocumentUrlFilters {
  const page = Number.parseInt(params.page ?? "", 10);
  return {
    query: params.query?.trim() ?? "",
    documentType: isDocumentType(params.documentType) ? params.documentType : undefined,
    serviceId: params.serviceId && isUuid(params.serviceId) ? params.serviceId : undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Parámetros de GET /documents a partir de los filtros de la URL. */
export function toListParams(filters: DocumentUrlFilters) {
  return {
    query: filters.query || undefined,
    documentType: filters.documentType,
    serviceId: filters.serviceId,
    page: filters.page - 1,
    size: PAGE_SIZE,
  };
}
