/** Backend: org.acme.payment.infrastructure.rest.dto */
import type {
  CurrencyCode,
  Decimal,
  ISODate,
  ISODateTime,
  UUID,
} from "./common";

export const PAYMENT_METHODS = [
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "BANK_TRANSFER",
  "DIRECT_DEBIT",
  "DIGITAL_WALLET",
  "OTHER",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** GET /payments, /payments/{id}, /obligations/{id}/payments */
export interface PaymentResponse {
  id: UUID;
  obligationId: UUID;
  amount: Decimal;
  currency: CurrencyCode;
  paymentDate: ISODate;
  paymentMethod: PaymentMethod;
  receiptDocumentId: UUID | null;
  notes: string | null;
  voided: boolean;
  voidedAt: ISODateTime | null;
  voidReason: string | null;
  /** Pago anterior que este corrige. */
  replacesPaymentId: UUID | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /payments. PUT /payments/{id} usa el mismo body (anula y reemplaza). */
export interface PaymentRequest {
  obligationId: UUID;
  amount: Decimal;
  currency: CurrencyCode;
  paymentDate: ISODate;
  paymentMethod: PaymentMethod;
  receiptDocumentId?: UUID | null;
  notes?: string | null;
}

export interface VoidPaymentRequest {
  reason: string;
}
