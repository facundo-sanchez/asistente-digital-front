/** Backend: org.acme.obligation.infrastructure.rest.dto */
import type {
  BillingFrequency,
  CurrencyCode,
  Decimal,
  ISODate,
  ISODateTime,
  UUID,
} from "./common";

export const OBLIGATION_TYPES = [
  "INVOICE_PAYMENT",
  "CREDIT_CARD_PAYMENT",
  "TAX",
  "INSURANCE",
  "VEHICLE_INSPECTION",
  "DOCUMENT_RENEWAL",
  "SUBSCRIPTION",
  "MAINTENANCE",
  "OTHER",
] as const;
export type ObligationType = (typeof OBLIGATION_TYPES)[number];

/** Estado persistido. */
export const OBLIGATION_STATUSES = [
  "PENDING",
  "PARTIALLY_PAID",
  "PAID",
  "CANCELLED",
] as const;
export type ObligationStatus = (typeof OBLIGATION_STATUSES)[number];

/** Estado a mostrar. DUE_SOON = vence en los próximos 7 días (zona horaria del usuario). */
export const EFFECTIVE_OBLIGATION_STATUSES = [
  "PENDING",
  "PARTIALLY_PAID",
  "DUE_SOON",
  "OVERDUE",
  "PAID",
  "CANCELLED",
] as const;
export type EffectiveObligationStatus =
  (typeof EFFECTIVE_OBLIGATION_STATUSES)[number];

export const RECURRENCE_ORIGINS = ["USER", "DETECTED"] as const;
export type RecurrenceOrigin = (typeof RECURRENCE_ORIGINS)[number];

/** GET /obligations, /obligations/{id}, /upcoming, /overdue */
export interface ObligationResponse {
  id: UUID;
  serviceId: UUID | null;
  /** Nombre del servicio asociado (null si no tiene). */
  serviceName: string | null;
  invoiceId: UUID | null;
  assetId: UUID | null;
  recurrenceId: UUID | null;
  title: string;
  description: string | null;
  obligationType: ObligationType;
  amount: Decimal | null;
  currency: CurrencyCode | null;
  dueDate: ISODate;
  status: ObligationStatus;
  effectiveStatus: EffectiveObligationStatus;
  /** Total pagado (pagos no anulados). */
  paidAmount: Decimal;
  /** Saldo pendiente; null si la obligación no tiene importe. */
  balance: Decimal | null;
  /** Anticipada por una recurrencia, todavía sin factura real. */
  estimated: boolean;
  cancelledAt: ISODateTime | null;
  cancelReason: string | null;
  paidAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /obligations, PUT /obligations/{id}. amount y currency van juntos. */
export interface ObligationRequest {
  title: string;
  description?: string | null;
  obligationType: ObligationType;
  serviceId?: UUID | null;
  assetId?: UUID | null;
  amount?: Decimal | null;
  currency?: CurrencyCode | null;
  dueDate: ISODate;
}

/** POST /obligations/{id}/cancel */
export interface CancelObligationRequest {
  reason?: string | null;
}

export interface RecurringRuleResponse {
  id: UUID;
  serviceId: UUID | null;
  assetId: UUID | null;
  title: string;
  frequency: Exclude<BillingFrequency, "NONE">;
  dayOfMonth: number | null;
  nextExpectedDate: ISODate;
  estimatedAmount: Decimal | null;
  currency: CurrencyCode | null;
  origin: RecurrenceOrigin;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** estimatedAmount y currency van juntos. */
export interface RecurringRuleRequest {
  serviceId?: UUID | null;
  assetId?: UUID | null;
  title: string;
  frequency: Exclude<BillingFrequency, "NONE">;
  /** 1 a 31. */
  dayOfMonth?: number | null;
  nextExpectedDate: ISODate;
  estimatedAmount?: Decimal | null;
  currency?: CurrencyCode | null;
  active?: boolean | null;
}
