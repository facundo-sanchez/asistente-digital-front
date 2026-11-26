/** Llamadas de pagos desde el navegador (módulo 4). */
import { api } from "@/lib/api/client";
import type { PaymentRequest, PaymentResponse, VoidPaymentRequest } from "@/types/api";

export const paymentsApi = {
  create: (request: PaymentRequest) => api.post<PaymentResponse>("payments", request),
  /** Anula el pago y crea uno nuevo que lo reemplaza. */
  correct: (id: string, request: PaymentRequest) => api.put<PaymentResponse>(`payments/${id}`, request),
  void: (id: string, request: VoidPaymentRequest) => api.post<void>(`payments/${id}/void`, request),
};
