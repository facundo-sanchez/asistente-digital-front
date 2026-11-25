import type { ServiceResponse } from "@/types/api";

/** Posibles duplicados encontrados, con la combinación proveedor|nro. de socio que los originó. */
export interface DuplicateSearchResult {
  key: string;
  services: ServiceResponse[];
}
