/** Backend: org.acme.invoice.application.model (revisión de una factura leída por la IA, módulo 9) */
import type { CurrencyCode, Decimal, ISODate, UUID } from "./common";
import type { ExtractionValidationStatus } from "./document";

/** Factura leída por la IA (invoice/1). Todo puede venir en null. */
export interface ExtractedInvoice {
  provider: string | null;
  customerReference: string | null;
  invoiceNumber: string | null;
  billingPeriod: string | null;
  issueDate: ISODate | null;
  dueDate: ISODate | null;
  totalAmount: Decimal | null;
  currency: CurrencyCode | null;
  paymentCode: string | null;
}

/** GET /invoice-extractions/{id} */
export interface InvoiceReviewResponse {
  extractionId: UUID;
  documentId: UUID;
  status: ExtractionValidationStatus;
  invoice: ExtractedInvoice;
  /** Servicio del usuario por número de socio o proveedor (null si no se encontró). */
  suggestedServiceId: UUID | null;
  /** Proveedor del catálogo si la factura llegó por email (para registrar el servicio que falta). */
  suggestedProviderId: UUID | null;
  warnings: string[];
  /** La factura creada, si ya se confirmó. */
  invoiceId: UUID | null;
}

/** POST /invoice-extractions/{id}/confirm */
export interface InvoiceConfirmationRequest {
  serviceId: UUID;
  invoiceNumber: string | null;
  billingPeriod: string | null;
  issueDate: ISODate | null;
  dueDate: ISODate;
  totalAmount: Decimal;
  currency: CurrencyCode;
  paymentCode: string | null;
}

/** GET /extractions?documentId=: la última propuesta de un documento y su esquema. */
export interface LatestExtractionResponse {
  id: UUID;
  /** "card_statement/1" o "invoice/1". */
  schemaVersion: string;
}
