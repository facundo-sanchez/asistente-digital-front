import type { ServiceCategory } from "@/types/api";
import type { ServiceStatusFilter } from "./service-status-filter";

/** Filtros del listado leídos de la URL de /services. */
export interface ServiceUrlFilters {
  /** Texto de búsqueda ("" = sin filtro). */
  query: string;
  category?: ServiceCategory;
  status: ServiceStatusFilter;
  /** Página para el usuario: empieza en 1. */
  page: number;
}
