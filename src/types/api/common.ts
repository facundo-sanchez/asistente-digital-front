/**
 * Tipos base de la API del backend (Quarkus, /api/v1).
 *
 * Reglas de correspondencia Java → TypeScript:
 *   UUID        → UUID (string)
 *   Instant     → ISODateTime  "2026-11-24T14:00:00Z"
 *   LocalDate   → ISODate      "2026-11-24"
 *   BigDecimal  → Decimal (number). Los cálculos financieros los hace el backend;
 *                 en el front solo se muestran/editan.
 *   enum        → unión de strings derivada de un array `as const`
 *   Map<String, Object> → Record<string, unknown>
 *
 * Responses: los campos nullable en Java llegan como `null` (Jackson incluye nulls),
 * por eso se tipan `T | null` y no como opcionales.
 * Requests: los campos no obligatorios se tipan como opcionales (`?:`).
 */

export type UUID = string;

/** Instante con zona, ISO-8601 (java.time.Instant). */
export type ISODateTime = string;

/** Fecha de calendario YYYY-MM-DD (java.time.LocalDate). */
export type ISODate = string;

/** Importe decimal (java.math.BigDecimal, NUMERIC(19,4)). */
export type Decimal = number;

/** Código de moneda ISO 4217, ej. "ARS". */
export type CurrencyCode = string;

export type JsonObject = Record<string, unknown>;

/** org.acme.shared.infrastructure.rest.dto.PageResponse */
export interface PageResponse<T> {
  content: T[];
  /** Base 0. */
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

/** Parámetros de consulta paginada (?page=0&size=20&sort=dueDate,asc). */
export interface PageParams {
  page?: number;
  size?: number;
  /** Formato "campo,asc" | "campo,desc". */
  sort?: string;
}

/**
 * Error uniforme del backend (org.acme.infrastructure.resources.rest.exceptions.ErrorResponse).
 * timestamp es LocalDateTime: sin zona horaria.
 */
export interface ErrorResponse {
  mensaje: string;
  status: number;
  timestamp: string;
  /** Errores por campo; solo en validaciones (400). */
  violations: FieldViolation[] | null;
}

export interface FieldViolation {
  /** Nombre del campo del request (ej. "email"). */
  field: string;
  message: string;
}

// ----------------------------------------------------------------------------
// Enums compartidos (org.acme.shared.domain.model)
// ----------------------------------------------------------------------------

export const SERVICE_CATEGORIES = [
  "ELECTRICITY",
  "GAS",
  "WATER",
  "INTERNET",
  "PHONE",
  "TV",
  "INSURANCE",
  "TAX",
  "SUBSCRIPTION",
  "HEALTH",
  "EDUCATION",
  "RENT",
  "CREDIT_CARD",
  "OTHER",
] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** NONE no es válido para reglas de recurrencia. */
export const BILLING_FREQUENCIES = [
  "NONE",
  "WEEKLY",
  "MONTHLY",
  "BIMONTHLY",
  "QUARTERLY",
  "SEMIANNUAL",
  "ANNUAL",
] as const;
export type BillingFrequency = (typeof BILLING_FREQUENCIES)[number];

export const DOCUMENT_TYPES = [
  "INVOICE",
  "CARD_STATEMENT",
  "PAYMENT_RECEIPT",
  "POLICY",
  "CONTRACT",
  "PERSONAL_ID",
  "OTHER",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
