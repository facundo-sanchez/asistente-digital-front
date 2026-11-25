import type { PageParams, ServiceCategory } from "@/types/api";

/** Filtros de GET /providers. */
export interface ProviderListParams extends Pick<PageParams, "page" | "size"> {
  /** Parte del nombre, sin distinguir mayúsculas. */
  query?: string;
  category?: ServiceCategory;
}
