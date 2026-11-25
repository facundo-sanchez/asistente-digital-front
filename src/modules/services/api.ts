/** Llamadas de servicios desde el navegador (módulo 2). */
import { api } from "@/lib/api/client";
import { toQueryString } from "@/lib/api/query-string";
import type { ServiceRequest, ServiceResponse, ServiceStatusRequest, UUID } from "@/types/api";

export const servicesApi = {
  create: (body: ServiceRequest) => api.post<ServiceResponse>("services", body),
  update: (id: UUID, body: ServiceRequest) => api.put<ServiceResponse>(`services/${encodeURIComponent(id)}`, body),
  /** Servicios propios con el mismo proveedor y nro. de socio, para avisar antes de guardar. */
  duplicates: (providerId: UUID, customerReference: string, excludeId?: UUID) =>
    api.get<ServiceResponse[]>(`services/duplicates${toQueryString({ providerId, customerReference, excludeId })}`),
  changeStatus: (id: UUID, body: ServiceStatusRequest) =>
    api.patch<ServiceResponse>(`services/${encodeURIComponent(id)}/status`, body),
};
