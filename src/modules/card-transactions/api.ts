/** Consumos con tarjeta desde el navegador (módulo 11). */
import { api } from "@/lib/api/client";
import type { CardTransactionResponse, SpendingCategory } from "@/types/api";

export const cardTransactionsApi = {
  recategorize: (id: string, category: SpendingCategory, applyToMerchant: boolean) =>
    api.patch<CardTransactionResponse>(`card-transactions/${id}/category`, { category, applyToMerchant }),
  deleteRule: (id: string) => api.delete<void>(`card-merchant-rules/${id}`),
};
