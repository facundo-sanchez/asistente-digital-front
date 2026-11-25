import type { ObligationResponse, PaymentRequest } from "@/types/api";
import type { PaymentFormValues } from "../validation";
import type { ReceiptOption } from "./receipt-option";

export interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  obligation: ObligationResponse;
  receipts: ReceiptOption[];
  /** Valores con los que arranca el formulario cada vez que se abre. */
  initialValues: PaymentFormValues;
  /** Muestra el saldo como ayuda del importe (al registrar, no al corregir). */
  showBalance: boolean;
  onSave: (request: PaymentRequest) => Promise<unknown>;
}
