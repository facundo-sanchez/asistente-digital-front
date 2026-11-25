/** Llamadas de obligaciones desde el navegador (módulo 4). */
import { api } from "@/lib/api/client";
import type { CancelObligationRequest, ObligationRequest, ObligationResponse } from "@/types/api";

export const obligationsApi = {
  create: (request: ObligationRequest) => api.post<ObligationResponse>("obligations", request),
  update: (id: string, request: ObligationRequest) => api.put<ObligationResponse>(`obligations/${id}`, request),
  cancel: (id: string, request: CancelObligationRequest) => api.post<void>(`obligations/${id}/cancel`, request),
};
