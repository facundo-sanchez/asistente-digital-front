/** Backend: org.acme.card.infrastructure.rest.dto (CU-015, CU-016, CU-017) */
import type {
  CurrencyCode,
  Decimal,
  ISODate,
  ISODateTime,
  UUID,
} from "./common";

export const CARD_BRANDS = [
  "VISA",
  "MASTERCARD",
  "AMEX",
  "CABAL",
  "NARANJA",
  "DINERS",
  "OTHER",
] as const;
export type CardBrand = (typeof CARD_BRANDS)[number];

export const CARD_STATEMENT_STATUSES = [
  "PENDING_VALIDATION",
  "CONFIRMED",
  "REJECTED",
] as const;
export type CardStatementStatus = (typeof CARD_STATEMENT_STATUSES)[number];

export const CARD_STATEMENT_SOURCES = ["MANUAL", "AI_EXTRACTION", "GMAIL"] as const;
export type CardStatementSource = (typeof CARD_STATEMENT_SOURCES)[number];

/** REFUND y PAYMENT siempre negativos. PAYMENT no cuenta como gasto. */
export const CARD_TRANSACTION_TYPES = [
  "PURCHASE",
  "INSTALLMENT",
  "REFUND",
  "FEE",
  "TAX",
  "INTEREST",
  "PAYMENT",
  "ADJUSTMENT",
] as const;
export type CardTransactionType = (typeof CARD_TRANSACTION_TYPES)[number];

export const SPENDING_CATEGORIES = [
  "SUPERMARKET",
  "RESTAURANTS",
  "FUEL",
  "TRANSPORT",
  "HEALTH",
  "EDUCATION",
  "ENTERTAINMENT",
  "TRAVEL",
  "CLOTHING",
  "HOME",
  "TECHNOLOGY",
  "SERVICES",
  "SUBSCRIPTIONS",
  "TAXES_FEES",
  "OTHER",
] as const;
export type SpendingCategory = (typeof SPENDING_CATEGORIES)[number];

/** USER prevalece sobre RULE y AI. */
export const CATEGORY_SOURCES = ["AI", "RULE", "USER"] as const;
export type CategorySource = (typeof CATEGORY_SOURCES)[number];

// ----------------------------------------------------------------------------
// Tarjetas
// ----------------------------------------------------------------------------

/** GET /cards, /cards/{id} */
export interface CardResponse {
  id: UUID;
  /** Servicio CREDIT_CARD del emisor. */
  serviceId: UUID;
  /** Nombre del servicio del emisor (ej. "Galicia"). */
  serviceName: string | null;
  name: string;
  brand: CardBrand;
  /** Últimos 4 de la tarjeta. */
  lastFour: string | null;
  /** Últimos 4 del número de cuenta (ej. BBVA lo informa así en el email). */
  accountLastFour: string | null;
  holderName: string | null;
  additional: boolean;
  creditLimit: Decimal | null;
  currency: CurrencyCode;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /cards, PUT /cards/{id}. Cierre y vencimiento no van: los fija el banco en cada resumen. */
export interface CardRequest {
  serviceId: UUID;
  name: string;
  brand: CardBrand;
  /** Últimos 4 de la tarjeta (4 dígitos). */
  lastFour?: string | null;
  /** Últimos 4 del número de cuenta (4 dígitos). */
  accountLastFour?: string | null;
  holderName?: string | null;
  additional?: boolean | null;
  creditLimit?: Decimal | null;
}

/** PATCH /cards/{id}/status */
export interface CardStatusRequest {
  active: boolean;
}

// ----------------------------------------------------------------------------
// Resúmenes
// ----------------------------------------------------------------------------

/** GET /cards/{id}/statements, /card-statements/{id} */
export interface CardStatementResponse {
  id: UUID;
  cardId: UUID;
  documentId: UUID | null;
  extractionResultId: UUID | null;
  /** Obligación de pago en moneda local. */
  obligationId: UUID | null;
  /** Obligación de pago en dólares. */
  obligationUsdId: UUID | null;
  periodStart: ISODate | null;
  /** null si el resumen se detectó por email sin PDF. */
  closingDate: ISODate | null;
  dueDate: ISODate;
  nextClosingDate: ISODate | null;
  nextDueDate: ISODate | null;
  /** Moneda local (la de la tarjeta). */
  currency: CurrencyCode;
  totalAmount: Decimal;
  totalAmountUsd: Decimal;
  minimumPayment: Decimal | null;
  status: CardStatementStatus;
  source: CardStatementSource;
  confirmedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /card-statements, PUT /card-statements/{id} */
export interface CardStatementRequest {
  cardId: UUID;
  documentId?: UUID | null;
  periodStart?: ISODate | null;
  /** Opcional si no se conoce. */
  closingDate?: ISODate | null;
  /** No anterior a closingDate. */
  dueDate: ISODate;
  nextClosingDate?: ISODate | null;
  nextDueDate?: ISODate | null;
  totalAmount: Decimal;
  /** Por defecto 0. */
  totalAmountUsd?: Decimal | null;
  minimumPayment?: Decimal | null;
}

/** Elemento de GET /card-statements/{id}/reconciliation (uno por moneda). */
export interface StatementReconciliationResponse {
  currency: CurrencyCode;
  statementTotal: Decimal;
  transactionsTotal: Decimal;
  /** statementTotal - transactionsTotal. */
  difference: Decimal;
  balanced: boolean;
}

// ----------------------------------------------------------------------------
// Consumos
// ----------------------------------------------------------------------------

/** GET /card-statements/{id}/transactions */
export interface CardTransactionResponse {
  id: UUID;
  cardId: UUID;
  statementId: UUID;
  /** En cuotas, la fecha original de compra. */
  transactionDate: ISODate;
  /** Texto tal como figura en el resumen. */
  description: string;
  merchantName: string | null;
  category: SpendingCategory;
  categorySource: CategorySource;
  transactionType: CardTransactionType;
  /** Con signo: + cargo, - crédito. */
  amount: Decimal;
  currency: CurrencyCode;
  installmentNumber: number | null;
  installmentTotal: number | null;
  originalAmount: Decimal | null;
  purchaseGroupId: UUID | null;
  reference: string | null;
  confidenceScore: Decimal | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** POST /card-statements/{id}/transactions, PUT /card-transactions/{id} */
export interface CardTransactionRequest {
  transactionDate: ISODate;
  description: string;
  merchantName?: string | null;
  category: SpendingCategory;
  transactionType: CardTransactionType;
  /** Distinto de 0. REFUND y PAYMENT negativos. */
  amount: Decimal;
  currency: CurrencyCode;
  /** Junto con installmentTotal; N <= M. */
  installmentNumber?: number | null;
  installmentTotal?: number | null;
  originalAmount?: Decimal | null;
  reference?: string | null;
}

/** PATCH /card-transactions/{id}/category */
export interface UpdateTransactionCategoryRequest {
  category: SpendingCategory;
  /** true = recordar la categoría para este comercio. */
  applyToMerchant?: boolean | null;
}

/** GET /card-merchant-rules */
export interface CardMerchantRuleResponse {
  id: UUID;
  merchantName: string;
  category: SpendingCategory;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

// ----------------------------------------------------------------------------
// Informe
// ----------------------------------------------------------------------------

/** GET /cards/installments/pending; también dentro del informe. */
export interface PendingInstallmentResponse {
  /** Id del último movimiento registrado de la compra. */
  id: UUID;
  cardId: UUID;
  purchaseGroupId: UUID | null;
  purchaseDate: ISODate;
  merchant: string;
  category: SpendingCategory;
  currency: CurrencyCode;
  installmentAmount: Decimal;
  /** Última cuota registrada. */
  installmentNumber: number;
  installmentTotal: number;
  remainingInstallments: number;
  remainingAmount: Decimal;
  originalAmount: Decimal | null;
  lastClosingDate: ISODate;
  /** Cierre estimado del resumen que incluirá la última cuota. */
  estimatedLastClosingDate: ISODate;
}

export interface CurrencyTotalResponse {
  currency: CurrencyCode;
  total: Decimal;
  count: number;
}

export interface CategorySpendingResponse {
  category: SpendingCategory;
  currency: CurrencyCode;
  total: Decimal;
  count: number;
}

export interface MonthlySpendingResponse {
  /** Primer día del mes de facturación. */
  month: ISODate;
  currency: CurrencyCode;
  total: Decimal;
  count: number;
}

export interface CardSpendingResponse {
  cardId: UUID;
  cardName: string;
  currency: CurrencyCode;
  total: Decimal;
  count: number;
}

export interface MerchantSpendingResponse {
  merchant: string;
  currency: CurrencyCode;
  total: Decimal;
  count: number;
}

/** GET /cards/report. Totales por moneda, sin conversión. */
export interface CardSpendingReportResponse {
  from: ISODate;
  to: ISODate;
  totals: CurrencyTotalResponse[];
  byCategory: CategorySpendingResponse[];
  byMonth: MonthlySpendingResponse[];
  byCard: CardSpendingResponse[];
  topMerchants: MerchantSpendingResponse[];
  pendingInstallments: PendingInstallmentResponse[];
  pendingInstallmentsTotals: CurrencyTotalResponse[];
}

/** Filtros de GET /cards/report. */
export interface CardReportFilters {
  from: ISODate;
  to: ISODate;
  cardId?: UUID;
  currency?: CurrencyCode;
}
