/** Revisión de resúmenes leídos por la IA desde el navegador (módulo 9). */
import { api } from "@/lib/api/client";
import type { CardStatementResponse, StatementConfirmationRequest, UUID } from "@/types/api";

export const extractionsApi = {
  /** Crea el resumen, sus vencimientos y sus movimientos con cuotas. */
  confirm: (id: UUID, request: StatementConfirmationRequest) => api.post<CardStatementResponse>(`extractions/${id}/confirm`, request),
  /** No crea nada; el documento queda guardado. */
  reject: (id: UUID) => api.post<void>(`extractions/${id}/reject`),
};
