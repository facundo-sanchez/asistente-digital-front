/** Llamadas del catálogo de proveedores (módulo 2). */
import { api } from "@/lib/api/client";
import { toQueryString } from "@/lib/api/query-string";
import type { PageResponse, ProviderRequest, ProviderResponse, UUID } from "@/types/api";
import type { ProviderListParams } from "./provider-list-params";

export const providersApi = {
  list: ({ query, category, page, size }: ProviderListParams = {}) =>
    api.get<PageResponse<ProviderResponse>>(`providers${toQueryString({ query, category, page, size })}`),
  get: (id: UUID) => api.get<ProviderResponse>(`providers/${encodeURIComponent(id)}`),
  /** Proveedor propio (no está en el catálogo). 409 si ya existe uno con ese nombre. */
  create: (body: ProviderRequest) => api.post<ProviderResponse>("providers", body),
  update: (id: string, body: ProviderRequest) => api.put<ProviderResponse>(`providers/${id}`, body),
};
