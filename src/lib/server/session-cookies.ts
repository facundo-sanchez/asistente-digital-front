/**
 * Cookies de sesión del BFF. Los tokens viven en cookies httpOnly: el JavaScript
 * del navegador no puede leerlos (SPEC §10.2).
 *
 * SameSite=Lax: el navegador no envía las cookies en POST cross-site, lo que
 * protege de CSRF a las rutas /api/* que modifican datos.
 */
import type { AuthResponse } from "@/types/api";
import type { CookieOptions } from "./cookie-options";
import type { CookieWriter } from "./cookie-writer";

export const ACCESS_COOKIE = "adv_session";
export const REFRESH_COOKIE = "adv_refresh";

const COOKIE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/";

/**
 * Cookies "Secure" (solo HTTPS). Por defecto sí en producción. COOKIE_SECURE=false
 * solo para despliegues internos sin TLS (ej. http://192.168.x.x): ahí el navegador
 * descartaría las cookies Secure y no se podría iniciar sesión.
 */
export const COOKIE_SECURE =
  process.env.COOKIE_SECURE != null
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production";

function options(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge,
  };
}

/**
 * Guarda la sesión. La cookie del access token vence junto con el token: cuando
 * desaparece, el proxy o el BFF renuevan la sesión con el refresh token.
 */
export function setSessionCookies(cookies: CookieWriter, session: AuthResponse): void {
  // 5 s de margen para no enviar un token a punto de vencer
  cookies.set(ACCESS_COOKIE, session.accessToken, options(Math.max(session.expiresIn - 5, 1)));
  cookies.set(REFRESH_COOKIE, session.refreshToken, options(session.refreshExpiresIn));
}

export function clearSessionCookies(cookies: CookieWriter): void {
  cookies.set(ACCESS_COOKIE, "", options(0));
  cookies.set(REFRESH_COOKIE, "", options(0));
}
