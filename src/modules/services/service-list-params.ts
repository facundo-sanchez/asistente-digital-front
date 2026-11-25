import type { PageParams, ServiceCategory } from "@/types/api";

/** Filtros de GET /services. */
export interface ServiceListParams extends Pick<PageParams, "page" | "size"> {
  /** Parte del nombre o del nro. de socio. */
  query?: string;
  category?: ServiceCategory;
  /** true: activos, false: inactivos, sin valor: todos. */
  active?: boolean;
}
