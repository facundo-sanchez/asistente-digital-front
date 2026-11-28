import type { FeedbackKind } from "@/types/api";

export const FEEDBACK_KIND_LABELS: Record<FeedbackKind, string> = {
  SUGGESTION: "Sugerencia",
  COMMENT: "Comentario",
  PROBLEM: "Algo no funciona bien",
  ERROR_REPORT: "Reporte de error",
};
