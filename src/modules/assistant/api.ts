/** Asistente IA desde el navegador (módulo 12). */
import { api } from "@/lib/api/client";
import type { ConversationResponse, MessageResponse } from "@/types/api";

export const assistantApi = {
  create: () => api.post<ConversationResponse>("assistant/conversations", {}),
  remove: (id: string) => api.delete<void>(`assistant/conversations/${id}`),
  send: (id: string, content: string) => api.post<MessageResponse>(`assistant/conversations/${id}/messages`, { content }),
};
