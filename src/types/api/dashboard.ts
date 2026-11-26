/** Backend: org.acme.dashboard.application.model (módulo 7) */
import type { CurrencyCode, Decimal, DocumentType, ISODate, ISODateTime, ServiceCategory, UUID } from "./common";

/** Lo del mes en una moneda. */
export interface MonthTotalsResponse {
  currency: CurrencyCode;
  total: Decimal;
  paid: Decimal;
  pending: Decimal;
}

/** Lo vencido sin pagar en una moneda. */
export interface OverdueTotalsResponse {
  currency: CurrencyCode;
  count: number;
  balance: Decimal;
}

/** GET /dashboard: mes actual en la zona del usuario; una fila por moneda (no se suman ni convierten). */
export interface DashboardSummaryResponse {
  monthStart: ISODate;
  monthEnd: ISODate;
  month: MonthTotalsResponse[];
  /** Vencimientos del mes sin importe cargado (no entran en los totales). */
  withoutAmount: number;
  overdue: OverdueTotalsResponse[];
  /** Cuántos vencen en los próximos 7 días. */
  dueSoon: number;
  activeServices: number;
  /** Lo que leyó la IA y espera revisión; schemaVersion "invoice/..." es factura, si no, resumen de tarjeta. */
  toReview: PendingReviewResponse[];
  /** Documentos que vencen en los próximos 30 días. */
  expiringDocuments: ExpiringDocumentResponse[];
  /** Lo último registrado (10 como mucho), lo más nuevo primero. */
  activity: DashboardActivityResponse[];
}

/** linkId: el vencimiento del pago, la tarjeta del resumen, o la propia factura/documento. */
export interface DashboardActivityResponse {
  kind: "PAYMENT" | "INVOICE" | "STATEMENT" | "DOCUMENT";
  id: UUID;
  linkId: UUID;
  title: string;
  amount: Decimal | null;
  currency: CurrencyCode | null;
  at: ISODateTime;
}

export interface PendingReviewResponse {
  id: UUID;
  schemaVersion: string;
  documentId: UUID;
  documentTitle: string | null;
  createdAt: ISODateTime;
}

export interface ExpiringDocumentResponse {
  id: UUID;
  title: string;
  documentType: DocumentType;
  expiresOn: ISODate;
}

/** Lo pagado en una moneda; key es el mes ("2026-11") o la categoría del servicio. */
export interface SpendingTotalResponse<K extends string = string> {
  key: K;
  currency: CurrencyCode;
  total: Decimal;
}

/** GET /dashboard/spending: últimos 6 meses por moneda (con ceros) y el mes actual por categoría. */
export interface DashboardSpendingResponse {
  months: SpendingTotalResponse[];
  categories: SpendingTotalResponse<ServiceCategory>[];
}
