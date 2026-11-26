import type { InvoiceResponse } from "@/types/api";

/** Resultado de la búsqueda de repetidas y la combinación de datos que la generó. */
export interface InvoiceDuplicateResult {
  key: string;
  invoices: InvoiceResponse[];
}
