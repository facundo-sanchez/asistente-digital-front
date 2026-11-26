/** Revisión de facturas leídas por la IA desde el navegador (módulo 9). */
import { api } from "@/lib/api/client";
import type { InvoiceConfirmationRequest, InvoiceResponse, UUID } from "@/types/api";

export const invoiceExtractionsApi = {
  /** Queda confirmada y genera su vencimiento. */
  confirm: (id: UUID, request: InvoiceConfirmationRequest) => api.post<InvoiceResponse>(`invoice-extractions/${id}/confirm`, request),
  /** No crea nada; el documento queda guardado. */
  reject: (id: UUID) => api.post<void>(`invoice-extractions/${id}/reject`),
};
