/** Backend: org.acme.invoice.infrastructure.rest.dto */
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

export interface InvoiceResponse {
  id: UUID;
  serviceId: UUID;
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
