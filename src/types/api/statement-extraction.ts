/** Backend: org.acme.card.application.model (revisión de un resumen leído por la IA, módulo 9) */
import type { Decimal, ISODate, UUID } from "./common";
import type { ExtractionValidationStatus } from "./document";

export interface ExtractedCard {
  lastFour: string | null;
  holderName: string | null;
  total: Decimal | null;
  totalUsd: Decimal | null;
}

/** Movimiento leído por la IA. amount con signo (pagos y devoluciones, negativos). */
export interface ExtractedTransaction {
  date: ISODate | null;
  description: string | null;
  merchant: string | null;
  installmentNumber: number | null;
  installmentTotal: number | null;
  amount: Decimal | null;
  currency: string | null;
  type: string | null;
  cardLastFour: string | null;
  reference: string | null;
}

/** Resumen leído por la IA (card_statement/1). Todo puede venir en null. */
export interface ExtractedStatement {
  bank: string | null;
  accountLastFour: string | null;
  closingDate: ISODate | null;
  dueDate: ISODate | null;
  nextClosingDate: ISODate | null;
  nextDueDate: ISODate | null;
  previousBalance: Decimal | null;
  previousBalanceUsd: Decimal | null;
  totalAmount: Decimal | null;
  totalAmountUsd: Decimal | null;
  minimumPayment: Decimal | null;
  cards: ExtractedCard[] | null;
  transactions: ExtractedTransaction[] | null;
}

/** GET /extractions/{id} */
export interface StatementReviewResponse {
  extractionId: UUID;
  documentId: UUID;
  status: ExtractionValidationStatus;
  statement: ExtractedStatement;
  /** Tarjeta del usuario con esos últimos 4 (null si no se encontró). */
  suggestedCardId: UUID | null;
  /** Avisos de los controles (cuadre de totales, datos que faltan, cuotas). */
  warnings: string[];
  transactionsTotal: Decimal;
  transactionsTotalUsd: Decimal;
  /** El resumen creado, si ya se confirmó. */
  statementId: UUID | null;
}

/** POST /extractions/{id}/confirm */
export interface StatementConfirmationRequest {
  cardId: UUID;
  closingDate: ISODate | null;
  dueDate: ISODate;
  nextClosingDate: ISODate | null;
  nextDueDate: ISODate | null;
  totalAmount: Decimal;
  totalAmountUsd: Decimal;
  minimumPayment: Decimal | null;
}
