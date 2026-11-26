/** Llamadas de facturas desde el navegador (módulo 5). */
import { api } from "@/lib/api/client";
import { toQueryString } from "@/lib/api/query-string";
import type { InvoiceRequest, InvoiceResponse, UUID } from "@/types/api";

export const invoicesApi = {
  /** Queda confirmada y genera su vencimiento. */
  create: (request: InvoiceRequest) => api.post<InvoiceResponse>("invoices", request),
  /** Confirmadas del servicio con el mismo número, o del mismo período e importe (RN-005). */
  duplicates: (params: { serviceId: UUID; invoiceNumber?: string; billingPeriod?: string; totalAmount?: number; excludeId?: UUID }) =>
    api.get<InvoiceResponse[]>(`invoices/duplicates${toQueryString(params)}`),
};
