import type { ErrorResponse } from "@/types/api";

/** Error HTTP de la API con el cuerpo de error del backend (si lo hay). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly data: ErrorResponse | null,
  ) {
    super(data?.mensaje ?? `Error HTTP ${status}`);
    this.name = "ApiError";
  }
}
