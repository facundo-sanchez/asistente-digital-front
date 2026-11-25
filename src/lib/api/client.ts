/**
 * Cliente HTTP del navegador. Nunca llama al backend directo: todo pasa por el BFF
 * de Next (/api/...), que agrega el token desde la cookie httpOnly.
 */
import type { ErrorResponse } from "@/types/api";
import { withBasePath } from "@/lib/config";
import { ApiError } from "./api-error";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function send(url: string, method: Method, body?: unknown): Promise<Response> {
  return fetch(url, {
    method,
    credentials: "same-origin",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.status === 202) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data as ErrorResponse | null);
  return data as T;
}

function goToLogin(): void {
  const next = window.location.pathname + window.location.search;
  window.location.assign(withBasePath(`/login?next=${encodeURIComponent(next)}`));
}

/**
 * Llamada a la API vía BFF (/api/backend/...).
 * Ante un 401 reintenta una vez: si otra pestaña/llamada renovó la sesión en paralelo,
 * la cookie nueva ya está disponible. Si persiste, lleva al login.
 */
export async function apiRequest<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const url = withBasePath(`/api/backend/${path.replace(/^\/+/, "")}`);
  let res = await send(url, method, body);
  if (res.status === 401) {
    res = await send(url, method, body);
    if (res.status === 401) {
      goToLogin();
    }
  }
  return parse<T>(res);
}

/** Rutas propias del BFF (/api/auth/...). Sin reintento: un 401 acá es un error de credenciales. */
export async function bffRequest<T>(method: Method, path: string, body?: unknown): Promise<T> {
  return parse<T>(await send(withBasePath(`/api/${path.replace(/^\/+/, "")}`), method, body));
}

export const api = {
  get: <T>(path: string) => apiRequest<T>("GET", path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => apiRequest<T>("PATCH", path, body),
  delete: <T>(path: string) => apiRequest<T>("DELETE", path),
};
