/** Llamadas de resúmenes de tarjeta desde el navegador (módulo 6). */
import { api } from "@/lib/api/client";
import type { CardStatementRequest, CardStatementResponse, UUID } from "@/types/api";

export const cardStatementsApi = {
  /** Queda confirmado y genera un vencimiento por moneda con saldo. */
  create: (request: CardStatementRequest) => api.post<CardStatementResponse>("card-statements", request),
  /** Copia los cambios a sus vencimientos (no si tienen pagos). */
  update: (id: UUID, request: CardStatementRequest) => api.put<CardStatementResponse>(`card-statements/${id}`, request),
  /** Anula el resumen y cancela sus vencimientos. */
  reject: (id: UUID) => api.post<void>(`card-statements/${id}/reject`),
};
