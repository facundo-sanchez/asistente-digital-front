import type { UUID } from "@/types/api";

/** Filtros del listado leídos de la URL de /invoices. */
export interface InvoiceUrlFilters {
  /** Número de factura ("" = sin filtro). */
  query: string;
  serviceId?: UUID;
  /** Vence desde / hasta (yyyy-mm-dd). */
  from?: string;
  to?: string;
  /** Página para el usuario: empieza en 1. */
  page: number;
}
