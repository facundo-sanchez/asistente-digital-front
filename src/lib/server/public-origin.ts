/** Solo servidor. */
import type { NextRequest } from "next/server";

/**
 * Origen con el que el navegador llegó (ej. http://localhost:3000). En Docker o detrás de un proxy,
 * request.nextUrl trae la dirección interna del servidor (http://0.0.0.0:3000), que el navegador no puede abrir.
 */
export function publicOrigin(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return request.nextUrl.origin;
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return `${proto.split(",")[0].trim()}://${host.split(",")[0].trim()}`;
}
