import type { UUID } from "@/types/api";

export interface DuplicateWarningProps {
  providerId?: UUID;
  customerReference: string;
  /** Al editar: el propio servicio no cuenta como duplicado. */
  excludeId?: UUID;
}
