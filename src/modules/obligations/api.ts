/** Llamadas de obligaciones desde el navegador (módulo 4). */
import { api } from "@/lib/api/client";
import type {
  CancelObligationRequest,
  ObligationRequest,
  ObligationResponse,
  RecurringRuleRequest,
  RecurringRuleResponse,
} from "@/types/api";

export const obligationsApi = {
  create: (request: ObligationRequest) => api.post<ObligationResponse>("obligations", request),
  update: (id: string, request: ObligationRequest) => api.put<ObligationResponse>(`obligations/${id}`, request),
  cancel: (id: string, request: CancelObligationRequest) => api.post<void>(`obligations/${id}/cancel`, request),
};

/** Vencimientos que se repiten (alquiler, seguros, VTV). */
export const recurringRulesApi = {
  create: (request: RecurringRuleRequest) => api.post<RecurringRuleResponse>("recurring-rules", request),
  update: (id: string, request: RecurringRuleRequest) => api.put<RecurringRuleResponse>(`recurring-rules/${id}`, request),
  changeStatus: (id: string, active: boolean) => api.patch<RecurringRuleResponse>(`recurring-rules/${id}/status`, { active }),
};
