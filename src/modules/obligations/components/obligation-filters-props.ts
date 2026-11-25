import type { ServiceOption } from "@/modules/documents/components/service-option";
import type { ObligationUrlFilters } from "../obligation-url-filters";

export interface ObligationFiltersProps {
  filters: ObligationUrlFilters;
  /** Servicios del usuario para el filtro por servicio. */
  services: ServiceOption[];
}
