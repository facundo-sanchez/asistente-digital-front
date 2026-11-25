/** Llamadas de documentos desde el navegador (módulo 3). */
import { uploadFile } from "@/lib/api/upload";
import type { DocumentResponse, DocumentType } from "@/types/api";

export const documentsApi = {
  upload: (file: File, documentType: DocumentType, title: string, onProgress: (percent: number) => void) => {
    const form = new FormData();
    form.append("file", file);
    form.append("documentType", documentType);
    if (title.trim()) form.append("title", title.trim());
    return uploadFile<DocumentResponse>("documents", form, onProgress);
  },
};
