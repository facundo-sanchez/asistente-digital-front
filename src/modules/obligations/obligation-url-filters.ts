import type { ServiceCategory, UUID } from "@/types/api";
import type { ObligationStatusFilter } from "./obligation-status-filter";

/** Filtros del listado leídos de la URL de /obligations. */
export interface ObligationUrlFilters {
  /** Texto de búsqueda ("" = sin filtro). */
  query: string;
  status: ObligationStatusFilter;
  serviceId?: UUID;
  category?: ServiceCategory;
  /** Vence desde / hasta (yyyy-mm-dd). */
  from?: string;
  to?: string;
  /** Página para el usuario: empieza en 1. */
  page: number;
}
