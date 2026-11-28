/** Comentarios y reportes de errores desde el navegador. */
import { api } from "@/lib/api/client";
import type { FeedbackRequest, FeedbackResponse } from "@/types/api";

export const feedbackApi = {
  send: (request: FeedbackRequest) => api.post<FeedbackResponse>("feedback", request),
};
