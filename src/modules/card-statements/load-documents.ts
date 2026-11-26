import type { DocumentResponse, PageResponse } from "@/types/api";
import { serverGet } from "@/lib/server/server-get";

/** Documentos del usuario como opciones para adjuntar el PDF (en el servidor). */
// shortcut: los 100 documentos más nuevos; con más, buscar al tipear
export async function loadDocumentOptions() {
  const page = await serverGet<PageResponse<DocumentResponse>>("/documents?size=100");
  return (page?.content ?? []).map((d) => ({ id: d.id, name: d.title ?? d.originalFilename }));
}
