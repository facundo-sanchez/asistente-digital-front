/** Backend: org.acme.assistant.infrastructure.rest.dto */
import type { ISODateTime, JsonObject, UUID } from "./common";

export const MESSAGE_ROLES = ["USER", "ASSISTANT", "TOOL", "SYSTEM"] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

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
  /** Referencias a registros y herramientas usadas. */
  metadata: JsonObject;
  createdAt: ISODateTime;
}

/** POST /assistant/conversations */
export interface CreateConversationRequest {
  title?: string | null;
}

/** POST /assistant/conversations/{id}/messages */
export interface SendMessageRequest {
  /** Máximo 4000 caracteres. */
  content: string;
}
