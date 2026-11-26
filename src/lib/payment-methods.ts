/** Medios de pago (los mismos del backend) con su nombre en español. */
import type { PaymentMethod } from "@/types/api";

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Transferencia",
  DEBIT_CARD: "Tarjeta de débito",
  CREDIT_CARD: "Tarjeta de crédito",
  DIRECT_DEBIT: "Débito automático",
  DIGITAL_WALLET: "Billetera virtual",
  CASH: "Efectivo",
  OTHER: "Otro",
};
