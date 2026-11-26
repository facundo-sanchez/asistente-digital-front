import type { ObligationResponse } from "@/types/api";
import type { ReceiptOption } from "./receipt-option";

export interface RegisterPaymentProps {
  obligation: ObligationResponse;
  /** Documentos del usuario que se pueden adjuntar como comprobante. */
  receipts: ReceiptOption[];
}
