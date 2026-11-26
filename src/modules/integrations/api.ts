/** Llamadas de integraciones desde el navegador (módulo 10). */
import { api } from "@/lib/api/client";
import type { SyncResponse } from "@/types/api";

export const integrationsApi = {
  sync: (id: string) => api.post<SyncResponse>(`integrations/${id}/sync`),
  disconnect: (id: string) => api.delete<void>(`integrations/${id}`),
};
