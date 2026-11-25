/** Llamadas de servicios desde el navegador (módulo 2). */
import { api } from "@/lib/api/client";
import type { ServiceRequest, ServiceResponse } from "@/types/api";

export const servicesApi = {
  create: (body: ServiceRequest) => api.post<ServiceResponse>("services", body),
};
