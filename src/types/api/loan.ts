/** Backend: org.acme.loan.infrastructure.rest.dto */
import type { CurrencyCode, Decimal, ISODate, ISODateTime, UUID } from "./common";
import type { ObligationResponse } from "./obligation";

export const LOAN_RATE_TYPES = ["FIXED", "VARIABLE"] as const;
export type LoanRateType = (typeof LOAN_RATE_TYPES)[number];

/** ACTIVE, PAID (sin cuotas pendientes) o CANCELLED. */
export type LoanStatus = "ACTIVE" | "PAID" | "CANCELLED";

/** GET /loans (installments vacío), GET /loans/{id} (con el cronograma). */
export interface LoanResponse {
  id: UUID;
  lender: string;
  name: string;
  loanNumber: string | null;
  shortReference: string | null;
  currency: CurrencyCode;
  principal: Decimal | null;
  rateType: LoanRateType | null;
  /** TNA en %. */
  annualRate: Decimal | null;
  disbursementDate: ISODate | null;
  installmentsCount: number;
  firstDueDate: ISODate;
  contractDocumentId: UUID | null;
  /** Último saldo de capital informado por el banco. */
  bankBalance: Decimal | null;
  bankBalanceDate: ISODate | null;
  notes: string | null;
  status: LoanStatus;
  cancelReason: string | null;
  paidInstallments: number;
  /** Suma de lo que falta de las cuotas pendientes (estimado hasta tener el importe real). */
  remaining: Decimal;
  totalPaid: Decimal;
  next: ObligationResponse | null;
  lastDueDate: ISODate | null;
  installments: ObligationResponse[];
  /** Cronograma calculado (tasa fija, sistema francés, sin sellados); vacío si no se puede calcular. */
  schedule: ScheduleRowResponse[];
  createdAt: ISODateTime;
}

export interface ScheduleRowResponse {
  number: number;
  interest: Decimal;
  capital: Decimal;
  vat: Decimal;
  /** Capital + interés + IVA (sin sellados). */
  amount: Decimal;
  /** Saldo de capital después de pagarla. */
  balance: Decimal;
}

/** PUT /loans/{id}: lo que se edita sin cambiar el cronograma. */
export interface LoanUpdateRequest {
  lender: string;
  name: string;
  loanNumber?: string | null;
  /** Referencia corta de los avisos por email del banco (ej. "203/2"). */
  shortReference?: string | null;
  principal?: Decimal | null;
  rateType?: LoanRateType | null;
  annualRate?: Decimal | null;
  disbursementDate?: ISODate | null;
  contractDocumentId?: UUID | null;
  notes?: string | null;
}

/** POST /loans */
export interface LoanRequest {
  lender: string;
  name: string;
  loanNumber?: string | null;
  shortReference?: string | null;
  currency: CurrencyCode;
  principal?: Decimal | null;
  rateType?: LoanRateType | null;
  annualRate?: Decimal | null;
  disbursementDate?: ISODate | null;
  installmentsCount: number;
  /** Obligatorio salvo tasa fija con capital y TNA (se calcula). */
  installmentAmount?: Decimal | null;
  firstDueDate: ISODate;
  paidInstallments: number;
  contractDocumentId?: UUID | null;
  notes?: string | null;
  /** Propuesta del comprobante de alta leído con IA, si se cargó desde ahí. */
  extractionId?: UUID | null;
}

export type ExtractionStatus = "PENDING" | "CONFIRMED" | "CORRECTED" | "REJECTED";

/** GET /loan-extractions/contract/{id}: el comprobante de alta leído (todo puede venir en null). */
export interface LoanContractReviewResponse {
  extractionId: UUID;
  documentId: UUID;
  status: ExtractionStatus;
  contract: {
    lender: string | null;
    loanNumber: string | null;
    loanType: string | null;
    principal: Decimal | null;
    currency: CurrencyCode | null;
    rateType: LoanRateType | null;
    annualRate: Decimal | null;
    disbursementDate: ISODate | null;
  };
  warnings: string[];
}

/** GET /loan-extractions/receipt/{id}: el comprobante de pago leído y su préstamo (por número). */
export interface LoanReceiptReviewResponse {
  extractionId: UUID;
  documentId: UUID;
  status: ExtractionStatus;
  receipt: {
    lender: string | null;
    loanNumber: string | null;
    principal: Decimal | null;
    disbursementDate: ISODate | null;
    installmentNumber: number | null;
    pendingInstallments: number | null;
    dueDate: ISODate | null;
    paymentDate: ISODate | null;
    totalAmount: Decimal | null;
    currency: CurrencyCode | null;
    capital: Decimal | null;
    interest: Decimal | null;
    vat: Decimal | null;
    stamps: Decimal | null;
    previousBalance: Decimal | null;
    newBalance: Decimal | null;
  };
  suggestedLoanId: UUID | null;
  warnings: string[];
}

/** POST /loan-extractions/receipt/{id}/confirm */
export interface LoanReceiptConfirmationRequest {
  loanId: UUID;
  installmentNumber: number;
  amount: Decimal;
  paymentDate: ISODate;
  newBalance?: Decimal | null;
}
