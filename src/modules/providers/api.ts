/** Llamadas del catálogo de proveedores (módulo 2, parte 2.1). */
import { api } from "@/lib/api/client";
import { toQueryString } from "@/lib/api/query-string";
import type { PageResponse, ProviderResponse, UUID } from "@/types/api";
import type { ProviderListParams } from "./provider-list-params";

export const providersApi = {
  list: ({ query, category, page, size }: ProviderListParams = {}) =>
    api.get<PageResponse<ProviderResponse>>(`providers${toQueryString({ query, category, page, size })}`),
  get: (id: UUID) => api.get<ProviderResponse>(`providers/${encodeURIComponent(id)}`),
};
