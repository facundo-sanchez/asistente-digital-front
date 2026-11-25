/**
 * Filtros del listado de servicios tal como viven en la URL de /services
 * (?query=&category=&status=&page=). page en la URL empieza en 1; en la API, en 0.
 */
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/types/api";
import type { ServiceListParams } from "./service-list-params";
import type { ServiceStatusFilter } from "./service-status-filter";
import type { ServiceUrlFilters } from "./service-url-filters";

export const DEFAULT_STATUS: ServiceStatusFilter = "active";

export const STATUS_LABELS: Record<ServiceStatusFilter, string> = {
  active: "Activos",
  inactive: "Inactivos",
  all: "Todos",
};

export const PAGE_SIZE = 20;

function isCategory(value: string | undefined): value is ServiceCategory {
  return !!value && (SERVICE_CATEGORIES as readonly string[]).includes(value);
}

function isStatus(value: string | undefined): value is ServiceStatusFilter {
  return value === "active" || value === "inactive" || value === "all";
}

/** Lee los filtros de la URL; los valores desconocidos se ignoran. */
export function parseFilters(params: Record<string, string | undefined>): ServiceUrlFilters {
  const page = Number.parseInt(params.page ?? "", 10);
  return {
    query: params.query?.trim() ?? "",
    category: isCategory(params.category) ? params.category : undefined,
    status: isStatus(params.status) ? params.status : DEFAULT_STATUS,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Convierte los filtros de la URL a los parámetros de GET /services. */
export function toListParams(filters: ServiceUrlFilters): ServiceListParams {
  return {
    query: filters.query || undefined,
    category: filters.category,
    active: filters.status === "all" ? undefined : filters.status === "active",
    page: filters.page - 1,
    size: PAGE_SIZE,
  };
}
