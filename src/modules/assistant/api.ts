/** Asistente IA desde el navegador (módulo 12). */
import { api } from "@/lib/api/client";
import { ApiError } from "@/lib/api/api-error";
import { withBasePath } from "@/lib/config";
import { parseSse } from "./sse";
import type { AssistantStreamEvent, ConversationResponse, MessageResponse } from "@/types/api";

export const assistantApi = {
  create: () => api.post<ConversationResponse>("assistant/conversations", {}),
  remove: (id: string) => api.delete<void>(`assistant/conversations/${id}`),
  send: (id: string, content: string) => api.post<MessageResponse>(`assistant/conversations/${id}/messages`, { content }),
};

/** Pregunta con respuesta progresiva: llama a onEvent con cada evento hasta el final. */
export async function streamAnswer(id: string, content: string, onEvent: (event: AssistantStreamEvent) => void, signal: AbortSignal) {
  const res = await fetch(withBasePath(`/api/backend/assistant/conversations/${id}/messages/stream`), {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
    body: JSON.stringify({ content }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new ApiError(res.status, await res.json().catch(() => null));
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    const parsed = parseSse(buffer + value);
    buffer = parsed.rest;
    parsed.events.forEach(onEvent);
  }
}
