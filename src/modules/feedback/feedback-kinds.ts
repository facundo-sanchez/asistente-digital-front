import type { FeedbackKind } from "@/types/api";

export const FEEDBACK_KIND_LABELS: Record<FeedbackKind, string> = {
  SUGGESTION: "Sugerencia",
  COMMENT: "Comentario",
  PROBLEM: "Algo no anda",
  ERROR_REPORT: "Reporte de error",
};
