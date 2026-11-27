/** Backend: org.acme.provider.infrastructure.rest.dto */
import type { ServiceCategory, UUID } from "./common";

/** GET /providers, GET /providers/{id} */
export interface ProviderResponse {
  id: UUID;
  name: string;
  code: string;
  category: ServiceCategory;
  website: string | null;
  /** true si lo creó el usuario (no es del catálogo). */
  custom: boolean;
  active: boolean;
  /** Solo en proveedores propios: dirección o dominio desde el que llegan sus facturas. */
  invoiceSender: string | null;
}

/** Alta de un proveedor propio del usuario. */
export interface ProviderRequest {
  name: string;
  category: ServiceCategory;
  website?: string | null;
  /** Dirección (info@empresa.com.ar) o dominio (empresa.com.ar) de sus facturas; vacío = ninguno. */
  invoiceSender?: string | null;
}
