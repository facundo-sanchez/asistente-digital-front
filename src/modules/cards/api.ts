/** Llamadas de tarjetas desde el navegador (módulo 6). */
import { api } from "@/lib/api/client";
import type { CardRequest, CardResponse, UUID } from "@/types/api";

export const cardsApi = {
  create: (request: CardRequest) => api.post<CardResponse>("cards", request),
  update: (id: UUID, request: CardRequest) => api.put<CardResponse>(`cards/${id}`, request),
  changeStatus: (id: UUID, active: boolean) => api.patch<CardResponse>(`cards/${id}/status`, { active }),
};
