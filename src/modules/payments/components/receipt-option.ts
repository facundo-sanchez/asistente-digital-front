import type { UUID } from "@/types/api";

/** Documento como opción de comprobante. */
export interface ReceiptOption {
  id: UUID;
  name: string;
}
