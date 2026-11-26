import type { ObligationResponse } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface ObligationFormProps {
  /** Si viene, el formulario edita esta obligación; si no, da de alta una nueva. */
  obligation?: ObligationResponse;
  /** Servicios del usuario para asociar la obligación. */
  services: ServiceOption[];
  /** Alta desde un servicio: arranca asociada a él y al cancelar vuelve a él. */
  defaultService?: ServiceOption;
}
