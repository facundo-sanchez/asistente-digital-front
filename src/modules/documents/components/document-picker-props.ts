import type { DocumentType, UUID } from "@/types/api";
import type { ServiceOption } from "./service-option";

export interface DocumentPickerProps {
  label: string;
  /** Id del documento elegido ("" = ninguno). */
  value: string;
  onChange: (documentId: string) => void;
  /** Documentos del usuario para elegir. */
  documents: ServiceOption[];
  /** Tipo y servicio con los que se guarda un archivo subido desde acá. */
  uploadType: DocumentType;
  serviceId?: UUID;
}
