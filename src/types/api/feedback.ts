/** Comentarios, sugerencias y reportes de errores (POST /feedback). */
import type { ISODateTime, UUID } from "./common";

export type FeedbackKind = "SUGGESTION" | "COMMENT" | "PROBLEM" | "ERROR_REPORT";

export interface FeedbackRequest {
  kind: FeedbackKind;
  message?: string;
  page?: string;
  /** Datos técnicos del error, JSON como texto. */
  details?: string;
}

export interface FeedbackResponse {
  id: UUID;
  kind: FeedbackKind;
  message: string;
  page: string | null;
  createdAt: ISODateTime;
}
