import type { CardResponse } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface CardFormProps {
  /** Si viene, el formulario edita esta tarjeta. */
  card?: CardResponse;
  /** Servicios del usuario de la categoría Tarjetas (bancos o emisores). */
  issuers: ServiceOption[];
  /** Alta desde un servicio: arranca con él elegido. */
  defaultIssuer?: ServiceOption;
}
