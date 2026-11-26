import type { UUID } from "@/types/api";

export interface InvoiceDuplicateProps {
  serviceId?: UUID;
  invoiceNumber: string;
  billingPeriod: string;
  /** Texto del campo importe ("48500,50"). */
  totalAmount: string;
  /** Al editar: la propia factura no cuenta como repetida. */
  excludeId?: UUID;
}
