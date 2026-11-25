import type { DocumentType, UUID } from "@/types/api";

/** Filtros del listado leídos de la URL de /documents. */
export interface DocumentUrlFilters {
  /** Texto de búsqueda ("" = sin filtro). */
  query: string;
  documentType?: DocumentType;
  serviceId?: UUID;
  /** Página para el usuario: empieza en 1. */
  page: number;
}
