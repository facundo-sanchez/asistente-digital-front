import { describe, expect, it } from "vitest";
import type { LoanReceiptReviewResponse } from "@/types/api";
import { fromReceipt } from "./prefill";

describe("préstamo desde un comprobante de pago", () => {
  it("deduce cuotas, primera fecha e importe", () => {
    const review = {
      receipt: { lender: "BBVA", loanNumber: "0017", principal: 7000000, installmentNumber: 10, pendingInstallments: 20, dueDate: "2026-11-07", totalAmount: 584292.14, currency: "ARS" },
    } as unknown as LoanReceiptReviewResponse;

    expect(fromReceipt(review)).toMatchObject({
      installmentsCount: 30,
      firstDueDate: "2026-02-07",
      installmentAmount: "584292,14",
      paidInstallments: 9,
      principal: "7000000",
    });
  });
});
