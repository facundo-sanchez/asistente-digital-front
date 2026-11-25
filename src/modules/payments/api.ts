/** Llamadas de pagos desde el navegador (módulo 4). */
import { api } from "@/lib/api/client";
import type { PaymentRequest, PaymentResponse } from "@/types/api";

export const paymentsApi = {
  create: (request: PaymentRequest) => api.post<PaymentResponse>("payments", request),
};
