/** Opciones de una llamada al backend desde el servidor de Next. */
export interface BackendRequest {
  method?: string;
  /** Objeto a serializar como JSON, o cuerpo crudo ya serializado. */
  body?: unknown;
  rawBody?: BodyInit | null;
  contentType?: string | null;
  accessToken?: string | null;
}
