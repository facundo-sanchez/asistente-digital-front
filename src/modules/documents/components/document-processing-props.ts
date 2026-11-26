import type { DocumentResponse, ProcessingJobResponse } from "@/types/api";

export interface DocumentProcessingProps {
  document: DocumentResponse;
  /** Último trabajo de lectura (null si nunca se pidió). */
  job: ProcessingJobResponse | null;
  /** Si este documento se puede leer con IA ahora (IA disponible y tipo soportado). */
  canProcess: boolean;
  /** Propuesta de la IA para revisar (cuando terminó de leerlo). */
  extractionId: string | null;
}
