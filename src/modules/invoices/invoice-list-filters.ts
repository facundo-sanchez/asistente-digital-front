/**
 * Filtros del listado de facturas tal como viven en la URL de /invoices
 * (?query=&serviceId=&from=&to=&page=). page en la URL empieza en 1; en la API, en 0.
 * Se listan las confirmadas: las anuladas se ven desde su vencimiento cancelado.
 */
import { isUuid } from "@/lib/uuid";
import type { InvoiceUrlFilters } from "./invoice-url-filters";

export const PAGE_SIZE = 20;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isoDate(value: string | undefined): string | undefined {
  return value && ISO_DATE.test(value) ? value : undefined;
}

/** Lee los filtros de la URL; los valores desconocidos se ignoran. */
export function parseFilters(params: Record<string, string | undefined>): InvoiceUrlFilters {
  const page = Number.parseInt(params.page ?? "", 10);
  return {
    query: params.query?.trim() ?? "",
    serviceId: params.serviceId && isUuid(params.serviceId) ? params.serviceId : undefined,
    from: isoDate(params.from),
    to: isoDate(params.to),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Parámetros de GET /invoices a partir de los filtros de la URL. */
export function toListParams(filters: InvoiceUrlFilters) {
  return {
    query: filters.query || undefined,
    serviceId: filters.serviceId,
    status: "CONFIRMED",
    from: filters.from,
    to: filters.to,
    page: filters.page - 1,
    size: PAGE_SIZE,
  };
}

export function hasActiveFilters(filters: InvoiceUrlFilters): boolean {
  return !!filters.query || !!filters.serviceId || !!filters.from || !!filters.to;
}
