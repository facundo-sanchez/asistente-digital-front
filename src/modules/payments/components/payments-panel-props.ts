import type { ObligationResponse } from "@/types/api";
import type { ReceiptOption } from "./receipt-option";

export interface PaymentsPanelProps {
  obligation: ObligationResponse;
  receipts: ReceiptOption[];
}
