import type { DocumentUrlFilters } from "../document-url-filters";
import type { ServiceOption } from "./service-option";

export interface DocumentFiltersProps {
  filters: DocumentUrlFilters;
  /** Servicios del usuario para el filtro por servicio. */
  services: ServiceOption[];
}
