/**
 * Chequeo optimista de sesión en cada navegación (Next.js 16: proxy.ts, ex middleware).
 * La autorización real la hace el backend en cada llamada; esto solo evita mostrar
 * pantallas privadas sin sesión y renueva el access token vencido.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GUEST_ONLY_PATHS, HOME_PATH, PUBLIC_PATHS, withBasePath } from "@/lib/config";
import { publicOrigin } from "@/lib/server/public-origin";
import { refreshSession } from "@/lib/server/backend";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearSessionCookies,
  setSessionCookies,
} from "@/lib/server/session-cookies";

function matches(pathname: string, paths: readonly string[]): boolean {
  return paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Redirección con el basePath y el origen con el que llegó el navegador (no la dirección interna del servidor). */
function redirectTo(request: NextRequest, pathname: string, next?: string): NextResponse {
  const search = next ? `?next=${encodeURIComponent(next)}` : "";
  return NextResponse.redirect(new URL(withBasePath(pathname) + search, publicOrigin(request)));
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAccess = request.cookies.has(ACCESS_COOKIE);
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  // La raíz es la presentación pública de la app
  if (pathname === "/" || matches(pathname, PUBLIC_PATHS)) {
    if ((hasAccess || refreshToken) && matches(pathname, GUEST_ONLY_PATHS)) {
      return redirectTo(request, HOME_PATH);
    }
    return NextResponse.next();
  }

  if (hasAccess) {
    return NextResponse.next();
  }

  // Access token vencido: se renueva en este mismo request
  if (refreshToken) {
    const result = await refreshSession(refreshToken);
    if (result.status === "renewed") {
      // La request que sigue (Server Components) ya ve la cookie nueva
      request.cookies.set(ACCESS_COOKIE, result.session.accessToken);
      request.cookies.set(REFRESH_COOKIE, result.session.refreshToken);
      const response = NextResponse.next({ request: { headers: request.headers } });
      setSessionCookies(response.cookies, result.session);
      return response;
    }
    if (result.status === "rotated") {
      // Otro pedido (ej. un prefetch) ya renovó: se repite con las cookies que dejó, sin borrarlas
      return NextResponse.redirect(new URL(withBasePath(pathname) + search, publicOrigin(request)));
    }
  }

  const response = redirectTo(request, "/login", pathname === "/" ? undefined : pathname + search);
  if (refreshToken) clearSessionCookies(response.cookies);
  return response;
}

export const config = {
  // Todo menos /api (el BFF maneja su propia sesión), assets de Next y archivos con extensión
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
