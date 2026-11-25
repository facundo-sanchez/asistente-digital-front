import { withBasePath } from "@/lib/config";

/** Archivo del documento vía BFF. inline = para mostrarlo en la página (vista previa). */
export function documentFileUrl(id: string, inline = false): string {
  return withBasePath(`/api/backend/documents/${id}/download${inline ? "?inline=true" : ""}`);
}
