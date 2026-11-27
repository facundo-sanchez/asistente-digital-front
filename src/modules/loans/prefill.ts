import type { LoanContractReviewResponse, LoanReceiptReviewResponse } from "@/types/api";
import { installmentDate } from "./schedule";
import type { LoanFormValues } from "./validation";

const text = (value: number | null) => (value == null ? "" : String(value).replace(".", ","));

/** Lo que el comprobante de alta trae para el formulario (cuotas, importe y primera fecha los completa el usuario). */
export function fromContract(review: LoanContractReviewResponse): Partial<LoanFormValues> {
  const c = review.contract;
  return {
    lender: c.lender ?? "",
    name: c.loanType ?? "Préstamo personal",
    loanNumber: c.loanNumber ?? "",
    currency: c.currency === "USD" ? "USD" : "ARS",
    principal: text(c.principal),
    rateType: c.rateType ?? "",
    annualRate: text(c.annualRate),
  };
}

/**
 * Lo que un comprobante de pago deja deducir: total de cuotas (pagada + pendientes), la primera fecha (n-1 meses
 * antes) y el importe. Las anteriores quedan pagadas; la del comprobante se paga al confirmarlo.
 */
export function fromReceipt(review: LoanReceiptReviewResponse): Partial<LoanFormValues> {
  const r = review.receipt;
  const n = r.installmentNumber ?? 0;
  const values: Partial<LoanFormValues> = {
    lender: r.lender ?? "",
    loanNumber: r.loanNumber ?? "",
    currency: r.currency === "USD" ? "USD" : "ARS",
    principal: text(r.principal),
    installmentAmount: text(r.totalAmount),
    paidInstallments: Math.max(n - 1, 0),
  };
  if (n > 0 && r.pendingInstallments != null) values.installmentsCount = n + r.pendingInstallments;
  if (n > 0 && r.dueDate) values.firstDueDate = installmentDate(r.dueDate, -(n - 1));
  return values;
}
