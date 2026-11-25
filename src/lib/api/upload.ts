/**
 * Subida de archivos por el BFF con avance (fetch no informa el progreso de una subida,
 * XMLHttpRequest sí). Mismo manejo de errores que el resto del cliente: ApiError.
 */
import type { ErrorResponse } from "@/types/api";
import { withBasePath } from "@/lib/config";
import { ApiError } from "./api-error";

/** POST multipart a /api/backend/{path}. onProgress recibe 0 a 100. */
export function uploadFile<T>(path: string, form: FormData, onProgress: (percent: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", withBasePath(`/api/backend/${path.replace(/^\/+/, "")}`));
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const data = parseJson(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) resolve(data as T);
      else reject(new ApiError(xhr.status, data as ErrorResponse | null));
    };
    // Sin conexión: el mismo error que da fetch, para que applyApiErrors lo trate igual
    xhr.onerror = () => reject(new TypeError("Sin conexión"));

    xhr.send(form);
  });
}

function parseJson(text: string): unknown {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
