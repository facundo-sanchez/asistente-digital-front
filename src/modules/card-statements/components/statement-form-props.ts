import type { CardResponse, CardStatementResponse } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface StatementFormProps {
  card: CardResponse;
  /** Si viene, el formulario corrige este resumen. */
  statement?: CardStatementResponse;
  /** Documentos del usuario para adjuntar el PDF del resumen. */
  documents: ServiceOption[];
}
