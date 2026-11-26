/** Llamadas de facturas desde el navegador (módulo 5). */
import { api } from "@/lib/api/client";
import type { InvoiceRequest, InvoiceResponse } from "@/types/api";

export const invoicesApi = {
  /** Queda confirmada y genera su vencimiento. */
  create: (request: InvoiceRequest) => api.post<InvoiceResponse>("invoices", request),
};
