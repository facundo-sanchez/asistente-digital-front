/** Estados y errores de la lectura con IA, para mostrar al usuario. */
import type { ProcessingStatus } from "@/types/api";

export const PROCESSING_STATUS_LABELS: Record<ProcessingStatus, string> = {
  NOT_REQUIRED: "Sin lectura con IA",
  PENDING: "En espera para leer",
  PROCESSING: "Leyendo con IA…",
  COMPLETED: "Leído",
  FAILED: "No pudimos leerlo",
  REQUIRES_REVIEW: "Listo para revisar",
};

/** Color del punto de estado (siempre con la palabra). */
export const PROCESSING_STATUS_COLORS: Record<ProcessingStatus, string> = {
  NOT_REQUIRED: "text.disabled",
  PENDING: "text.secondary",
  PROCESSING: "info.main",
  COMPLETED: "success.main",
  FAILED: "error.main",
  REQUIRES_REVIEW: "warning.main",
};

/** Explicación del error guardado en el trabajo (código, nunca contenido del documento). */
export function processingErrorMessage(code: string | null): string {
  switch (code) {
    case "NOT_CONFIGURED":
      return "La lectura con IA no está configurada.";
    case "UNAVAILABLE":
      return "El servicio de IA no respondió.";
    case "INVALID_RESPONSE":
      return "La IA no devolvió datos que se puedan usar.";
    case "UNREADABLE_FILE":
      return "No pudimos abrir el archivo (puede estar dañado o protegido).";
    case "TOO_MANY_ATTEMPTS":
      return "Se intentó varias veces sin éxito.";
    default:
      return "Ocurrió un error al leerlo.";
  }
}
