import type { NextRequest } from "next/server";
import { redirectTo } from "@/lib/server/route-helpers";
import { clearSessionCookies } from "@/lib/server/session-cookies";

/**
 * Sesión rechazada por el backend (usuario deshabilitado, token revocado...).
 * Los Server Components no pueden borrar cookies: redirigen acá, que las borra y
 * lleva al login. Sin efectos fuera de la propia sesión, por eso es GET.
 */
export function GET(request: NextRequest) {
  const response = redirectTo(request, "/login?expired=1");
  clearSessionCookies(response.cookies);
  return response;
}
