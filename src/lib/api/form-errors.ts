import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "./api-error";

/**
 * Lleva los errores del backend al formulario: las violaciones por campo se marcan
 * en su input y se devuelve el mensaje general para mostrar arriba.
 *
 * @param fieldMap renombra campos del backend a campos del form (ej. newPassword -> password)
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fieldMap: Record<string, Path<T>> = {},
): string {
  if (!(error instanceof ApiError)) {
    return "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
  }
  const violations = error.data?.violations ?? [];
  for (const v of violations) {
    const field = (fieldMap[v.field] ?? v.field) as Path<T>;
    setError(field, { type: "server", message: v.message });
  }
  return error.data?.mensaje ?? "Ocurrió un error inesperado.";
}
