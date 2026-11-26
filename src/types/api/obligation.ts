/** Backend: org.acme.obligation.infrastructure.rest.dto */
import type {
  BillingFrequency,
  ServiceCategory,
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
  "RENT",
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
  /** Categoría del servicio (da su color en las listas; null si no tiene). */
  serviceCategory: ServiceCategory | null;
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

/** Frecuencias válidas para una repetición. */
export type RecurringFrequency = Exclude<BillingFrequency, "NONE">;

/** GET /recurring-rules, /recurring-rules/{id} */
export interface RecurringRuleResponse {
  id: UUID;
  serviceId: UUID | null;
  title: string;
  obligationType: ObligationType;
  frequency: RecurringFrequency;
  /** Día del mes en que vence (null si es semanal). */
  dayOfMonth: number | null;
  /** Vencimiento del próximo período que todavía no se generó. */
  nextExpectedDate: ISODate;
  amount: Decimal | null;
  currency: CurrencyCode | null;
  origin: RecurrenceOrigin;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /recurring-rules, PUT /recurring-rules/{id}. amount y currency van juntos. */
export interface RecurringRuleRequest {
  title: string;
  obligationType: ObligationType;
  serviceId: UUID | null;
  frequency: RecurringFrequency;
  /** Al crear: el primer vencimiento. Su día del mes se repite. */
  nextExpectedDate: ISODate;
  amount: Decimal | null;
  currency: CurrencyCode | null;
}

/** PATCH /recurring-rules/{id}/status */
export interface RecurringRuleStatusRequest {
  active: boolean;
}
