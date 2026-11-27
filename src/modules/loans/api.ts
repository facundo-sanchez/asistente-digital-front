/** Préstamos desde el navegador (módulo 13). */
import { api } from "@/lib/api/client";
import type { LoanReceiptConfirmationRequest, LoanRequest, LoanResponse, LoanUpdateRequest } from "@/types/api";

export const loansApi = {
  create: (body: LoanRequest) => api.post<LoanResponse>("loans", body),
  changeInstallment: (id: string, number: number, amount: number) =>
    api.patch<LoanResponse>(`loans/${id}/installments/${number}`, { amount }),
  update: (id: string, body: LoanUpdateRequest) => api.put<LoanResponse>(`loans/${id}`, body),
  cancel: (id: string, reason: string) => api.post<LoanResponse>(`loans/${id}/cancel`, { reason }),
  confirmReceipt: (extractionId: string, body: LoanReceiptConfirmationRequest) =>
    api.post<LoanResponse>(`loan-extractions/receipt/${extractionId}/confirm`, body),
  reject: (extractionId: string) => api.post<void>(`loan-extractions/${extractionId}/reject`),
};
