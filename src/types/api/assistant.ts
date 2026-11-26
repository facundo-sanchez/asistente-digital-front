/** Backend: org.acme.assistant.infrastructure.rest.dto */
import type { ISODateTime, JsonObject, UUID } from "./common";

export const MESSAGE_ROLES = ["USER", "ASSISTANT", "TOOL", "SYSTEM"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

export const REFERENCE_TYPES = ["OBLIGATION", "INVOICE", "SERVICE", "DOCUMENT"] as const;
export type ReferenceType = (typeof REFERENCE_TYPES)[number];

/** Un registro que usó la respuesta (metadata.references de un mensaje del asistente). */
export interface AssistantReference {
  type: ReferenceType;
  id: UUID;
  label: string;
}

/** GET /assistant/conversations */
export interface ConversationResponse {
  id: UUID;
  title: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** GET /assistant/conversations/{id} */
export interface ConversationDetailResponse {
  id: UUID;
  title: string | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  messages: MessageResponse[];
}

export interface MessageResponse {
  id: UUID;
  role: MessageRole;
  content: string;
  /** references: registros usados (AssistantReference[]); tools: herramientas llamadas. */
  metadata: JsonObject;
  createdAt: ISODateTime;
}

/** Evento de POST /assistant/conversations/{id}/messages/stream (SSE). */
export interface AssistantStreamEvent {
  /** tool: consulta una herramienta (text = su nombre); text: un pedazo de la respuesta; done: message guardado; error: text = mensaje. */
  type: "tool" | "text" | "done" | "error";
  text: string | null;
  message: MessageResponse | null;
}

/** POST /assistant/conversations */
export interface CreateConversationRequest {
  title?: string | null;
}

/** POST /assistant/conversations/{id}/messages */
export interface SendMessageRequest {
  /** Hasta 4000 caracteres. */
  content: string;
}
