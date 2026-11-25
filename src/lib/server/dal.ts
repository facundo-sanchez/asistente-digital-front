/**
 * Data Access Layer de sesión para Server Components.
 * La validación real del token la hace el backend: acá solo se consulta /users/me.
 */
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserResponse } from "@/types/api";
import { backendFetch } from "./backend";
import { ACCESS_COOKIE } from "./session-cookies";

/** Ruta que limpia las cookies y lleva al login (los Server Components no pueden borrar cookies). */
export const SESSION_EXPIRED_PATH = "/api/auth/session-expired";

/**
 * Usuario de la sesión actual, o null si no hay sesión o el backend la rechaza (401).
 * Si el backend falla por otro motivo, lanza: lo muestra error.tsx en lugar de cerrar la sesión.
 * Memoizado por request con cache().
 */
export const getCurrentUser = cache(async (): Promise<UserResponse | null> => {
  const accessToken = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  const res = await backendFetch("/users/me", { accessToken });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`No se pudo obtener el usuario (HTTP ${res.status})`);
  return (await res.json()) as UserResponse;
});

/** Usuario de la sesión o redirección al login. */
export async function requireUser(): Promise<UserResponse> {
  const user = await getCurrentUser();
  if (!user) redirect(SESSION_EXPIRED_PATH);
  return user;
}
