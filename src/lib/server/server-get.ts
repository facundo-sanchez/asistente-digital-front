/**
 * GET al backend desde Server Components, con el access token de la cookie.
 * Solo servidor. El proxy ya renovó la sesión antes de llegar acá.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendFetch } from "./backend";
import { SESSION_EXPIRED_PATH } from "./dal";
import { ACCESS_COOKIE } from "./session-cookies";

/**
 * Devuelve el cuerpo, o null si el backend responde 404 (para usar notFound()).
 * 401: la sesión no sirve, lleva al login. Otro error: lanza (lo muestra error.tsx).
 */
export async function serverGet<T>(path: string): Promise<T | null> {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) redirect(SESSION_EXPIRED_PATH);

  const res = await backendFetch(path, { accessToken });
  if (res.status === 401) redirect(SESSION_EXPIRED_PATH);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error del backend en GET ${path} (HTTP ${res.status})`);
  return (await res.json()) as T;
}
