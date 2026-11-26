/** Llamadas de documentos desde el navegador (módulo 3). */
import { api } from "@/lib/api/client";
import { uploadFile } from "@/lib/api/upload";
import type { DocumentResponse, DocumentType, DocumentUpdateRequest, ProcessingJobResponse } from "@/types/api";

export const documentsApi = {
  upload: (file: File, documentType: DocumentType, title: string, serviceId: string | null, onProgress: (percent: number) => void, process = false) => {
    const form = new FormData();
    form.append("file", file);
    form.append("documentType", documentType);
    if (title.trim()) form.append("title", title.trim());
    if (serviceId) form.append("serviceId", serviceId);
    // Pedir la lectura con IA es el consentimiento para enviar el archivo (RN-007)
    if (process) form.append("process", "true");
    return uploadFile<DocumentResponse>("documents", form, onProgress);
  },
  update: (id: string, request: DocumentUpdateRequest) => api.put<DocumentResponse>(`documents/${id}`, request),
  remove: (id: string) => api.delete<void>(`documents/${id}`),
  /** Encola la lectura con IA (o devuelve la que está en curso). */
  process: (id: string) => api.post<ProcessingJobResponse>(`documents/${id}/process`),
};
