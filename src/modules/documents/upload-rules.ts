/**
 * Reglas de archivo del lado del cliente: las mismas que valida el backend
 * (UploadDocumentUseCase y FileType). Acá solo sirven para avisar antes de subir.
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const XLS_TYPE = "application/vnd.ms-excel";

export const ACCEPTED_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WEBP",
  [XLSX_TYPE]: "Excel",
  [XLS_TYPE]: "Excel",
};

/** Extensiones por si el navegador no informa el tipo (pasa con algunos .xls en Windows). */
const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".xlsx", ".xls"];

/** Valor para el atributo accept del input de archivo. */
export const ACCEPT_ATTRIBUTE = [...Object.keys(ACCEPTED_TYPES), ".xlsx", ".xls"].join(",");

/** Texto para el usuario con los tipos admitidos. */
export const ACCEPTED_LABEL = "PDF, JPG, PNG, WEBP o Excel";

/** Mensaje de error si el archivo no sirve, o null si está bien. */
export function validateFile(file: File): string | null {
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > MAX_FILE_SIZE) return "El archivo supera el máximo de 10 MB.";
  const name = file.name.toLowerCase();
  const known = file.type ? file.type in ACCEPTED_TYPES : ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!known) return `Solo se admiten archivos ${ACCEPTED_LABEL}.`;
  return null;
}

/** true si el tipo es una planilla de Excel (no tiene vista previa en el navegador). */
export function isSpreadsheet(mimeType: string): boolean {
  return mimeType === XLSX_TYPE || mimeType === XLS_TYPE;
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
