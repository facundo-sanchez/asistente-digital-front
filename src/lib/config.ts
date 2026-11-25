/** Prefijo de la app (next.config basePath). Vacío si vive en la raíz. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Agrega el basePath a una ruta interna. Solo hace falta para fetch / window.location:
 * <Link>, router.push y redirect() ya lo agregan solos.
 */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Rutas públicas (sin sesión). */
export const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

/** Rutas públicas a las que no tiene sentido entrar con sesión iniciada. */
export const GUEST_ONLY_PATHS = ["/login", "/register", "/forgot-password"] as const;

export const HOME_PATH = "/dashboard";

/**
 * Valida el destino post-login (?next=). Solo rutas internas: evita open redirects
 * del tipo ?next=https://sitio-malicioso o ?next=//sitio-malicioso.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return HOME_PATH;
  }
  return next;
}
