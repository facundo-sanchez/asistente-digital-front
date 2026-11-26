import type { ServiceOption } from "@/modules/documents/components/service-option";
import type { InvoiceUrlFilters } from "../invoice-url-filters";

export interface InvoiceFiltersProps {
  filters: InvoiceUrlFilters;
  services: ServiceOption[];
}
