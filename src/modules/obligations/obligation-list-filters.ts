/**
 * Filtros del listado de vencimientos tal como viven en la URL de /obligations
 * (?query=&status=&serviceId=&category=&from=&to=&page=). page en la URL empieza en 1; en la API, en 0.
 */
import { SERVICE_CATEGORIES, type EffectiveObligationStatus, type ServiceCategory } from "@/types/api";
import { isUuid } from "@/lib/uuid";
import type { ObligationStatusFilter } from "./obligation-status-filter";
import type { ObligationUrlFilters } from "./obligation-url-filters";

export const PAGE_SIZE = 20;
export const DEFAULT_STATUS: ObligationStatusFilter = "open";

export const STATUS_FILTER_LABELS: Record<ObligationStatusFilter, string> = {
  open: "Por pagar",
  overdue: "Vencidas",
  due_soon: "Próximas a vencer",
  paid: "Pagadas",
  cancelled: "Canceladas",
  all: "Todas",
};

/** Estados efectivos que pide cada opción (vacío = sin filtro). */
const STATUS_FILTER_VALUES: Record<ObligationStatusFilter, EffectiveObligationStatus[]> = {
  open: ["PENDING", "PARTIALLY_PAID", "DUE_SOON", "OVERDUE"],
  overdue: ["OVERDUE"],
  due_soon: ["DUE_SOON"],
  paid: ["PAID"],
  cancelled: ["CANCELLED"],
  all: [],
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isStatusFilter(value: string | undefined): value is ObligationStatusFilter {
  return !!value && value in STATUS_FILTER_LABELS;
}

function isCategory(value: string | undefined): value is ServiceCategory {
  return !!value && (SERVICE_CATEGORIES as readonly string[]).includes(value);
}

function isoDate(value: string | undefined): string | undefined {
  return value && ISO_DATE.test(value) ? value : undefined;
}

/** Lee los filtros de la URL; los valores desconocidos se ignoran. */
export function parseFilters(params: Record<string, string | undefined>): ObligationUrlFilters {
  const page = Number.parseInt(params.page ?? "", 10);
  return {
    query: params.query?.trim() ?? "",
    status: isStatusFilter(params.status) ? params.status : DEFAULT_STATUS,
    serviceId: params.serviceId && isUuid(params.serviceId) ? params.serviceId : undefined,
    category: isCategory(params.category) ? params.category : undefined,
    from: isoDate(params.from),
    to: isoDate(params.to),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Parámetros de GET /obligations a partir de los filtros de la URL. */
export function toListParams(filters: ObligationUrlFilters) {
  const statuses = STATUS_FILTER_VALUES[filters.status];
  return {
    query: filters.query || undefined,
    status: statuses.length > 0 ? statuses.join(",") : undefined,
    serviceId: filters.serviceId,
    category: filters.category,
    from: filters.from,
    to: filters.to,
    page: filters.page - 1,
    size: PAGE_SIZE,
  };
}

/** true si el usuario filtró algo además del estado por defecto. */
export function hasActiveFilters(filters: ObligationUrlFilters): boolean {
  return !!filters.query || filters.status !== DEFAULT_STATUS || !!filters.serviceId || !!filters.category || !!filters.from || !!filters.to;
}
