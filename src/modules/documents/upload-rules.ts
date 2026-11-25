/**
 * Reglas de archivo del lado del cliente: las mismas que valida el backend
 * (UploadDocumentUseCase). Acá solo sirven para avisar antes de subir.
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
};

/** Valor para el atributo accept del input de archivo. */
export const ACCEPT_ATTRIBUTE = Object.keys(ACCEPTED_TYPES).join(",");

/** Mensaje de error si el archivo no sirve, o null si está bien. */
export function validateFile(file: File): string | null {
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > MAX_FILE_SIZE) return "El archivo supera el máximo de 10 MB.";
  if (!(file.type in ACCEPTED_TYPES)) return "Solo se admiten archivos PDF, JPG, PNG o WEBP.";
  return null;
}

/** 1536 → "1,5 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toLocaleString("es-AR", { maximumFractionDigits: 1 })} ${units[unit]}`;
}
