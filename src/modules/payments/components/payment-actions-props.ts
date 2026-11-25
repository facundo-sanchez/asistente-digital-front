import type { ObligationResponse, PaymentResponse } from "@/types/api";
import type { ReceiptOption } from "./receipt-option";

export interface PaymentActionsProps {
  payment: PaymentResponse;
  obligation: ObligationResponse;
  receipts: ReceiptOption[];
}
