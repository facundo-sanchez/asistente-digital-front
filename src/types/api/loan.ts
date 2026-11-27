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
  createdAt: ISODateTime;
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
  installmentAmount: Decimal;
  firstDueDate: ISODate;
  paidInstallments: number;
  contractDocumentId?: UUID | null;
  notes?: string | null;
}
