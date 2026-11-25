/** Llamadas de servicios desde el navegador (módulo 2). */
import { api } from "@/lib/api/client";
import type { ServiceRequest, ServiceResponse, ServiceStatusRequest, UUID } from "@/types/api";

export const servicesApi = {
  create: (body: ServiceRequest) => api.post<ServiceResponse>("services", body),
  update: (id: UUID, body: ServiceRequest) => api.put<ServiceResponse>(`services/${encodeURIComponent(id)}`, body),
  changeStatus: (id: UUID, body: ServiceStatusRequest) =>
    api.patch<ServiceResponse>(`services/${encodeURIComponent(id)}/status`, body),
};
