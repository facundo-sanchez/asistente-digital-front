/** Backend: org.acme.invoice.infrastructure.rest.dto */
import type { EffectiveObligationStatus } from "./obligation";
import type {
  CurrencyCode,
  Decimal,
  ISODate,
  ISODateTime,
  UUID,
} from "./common";

export const INVOICE_STATUSES = [
  "PENDING_VALIDATION",
  "CONFIRMED",
  "REJECTED",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const INVOICE_SOURCES = [
  "MANUAL",
  "AI_EXTRACTION",
  "GMAIL",
  "INTEGRATION",
] as const;
export type InvoiceSource = (typeof INVOICE_SOURCES)[number];

/** GET /invoices, /invoices/{id}, POST /invoices */
export interface InvoiceResponse {
  id: UUID;
  serviceId: UUID;
  /** Nombre del servicio. */
  serviceName: string | null;
  documentId: UUID | null;
  extractionResultId: UUID | null;
  invoiceNumber: string | null;
  /** Ej. "2026-12". */
  billingPeriod: string | null;
  issueDate: ISODate | null;
  dueDate: ISODate;
  totalAmount: Decimal;
  currency: CurrencyCode;
  paymentCode: string | null;
  status: InvoiceStatus;
  source: InvoiceSource;
  /** 0 a 1. Referencia técnica, no garantía de exactitud. */
  confidenceScore: Decimal | null;
  confirmedAt: ISODateTime | null;
  /** Vencimiento que generó la factura (null si no generó). */
  obligationId: UUID | null;
  /** Estado de ese vencimiento: pendiente, pagado, vencido… */
  obligationStatus: EffectiveObligationStatus | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /invoices, PUT /invoices/{id} */
export interface InvoiceRequest {
  serviceId: UUID;
  documentId?: UUID | null;
  invoiceNumber?: string | null;
  billingPeriod?: string | null;
  issueDate?: ISODate | null;
  dueDate: ISODate;
  totalAmount: Decimal;
  currency: CurrencyCode;
  paymentCode?: string | null;
}
