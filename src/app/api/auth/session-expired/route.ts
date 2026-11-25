import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookies } from "@/lib/server/session-cookies";

/**
 * Sesión rechazada por el backend (usuario deshabilitado, token revocado...).
 * Los Server Components no pueden borrar cookies: redirigen acá, que las borra y
 * lleva al login. Sin efectos fuera de la propia sesión, por eso es GET.
 */
export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "?expired=1";
  const response = NextResponse.redirect(url);
  clearSessionCookies(response.cookies);
  return response;
}
