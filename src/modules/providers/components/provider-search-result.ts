import type { ProviderResponse } from "@/types/api";

/** Resultado de una búsqueda de proveedores, junto con el texto que la originó. */
export interface ProviderSearchResult {
  query: string;
  options: ProviderResponse[];
  failed: boolean;
}
