/**
 * Cliente HTTP del backend (Quarkus). SOLO para código de servidor:
 * route handlers, proxy y Server Components.
 */
import type { AuthResponse, ErrorResponse } from "@/types/api";
import type { BackendRequest } from "./backend-request";
import type { RefreshResult } from "./refresh-result";

const API_BACKEND =
  process.env.API_BACKEND ?? "http://localhost:8080/asistente-digital-back/api/v1";

export async function backendFetch(path: string, req: BackendRequest = {}): Promise<Response> {
  const headers = new Headers({ Accept: req.accept ?? "application/json" });
  let body: BodyInit | undefined;

  if (req.rawBody != null) {
    body = req.rawBody;
    if (req.contentType) headers.set("Content-Type", req.contentType);
  } else if (req.body !== undefined) {
    body = JSON.stringify(req.body);
    headers.set("Content-Type", "application/json");
  }
  if (req.accessToken) {
    headers.set("Authorization", `Bearer ${req.accessToken}`);
  }

  return fetch(`${API_BACKEND}${path.startsWith("/") ? path : `/${path}`}`, {
    method: req.method ?? "GET",
    headers,
    body,
    cache: "no-store",
  });
}

/** Renueva la sesión con el refresh token. El backend responde 409 si otro pedido ya lo rotó. */
export async function refreshSession(refreshToken: string): Promise<RefreshResult> {
  try {
    const res = await backendFetch("/auth/refresh", { method: "POST", body: { refreshToken } });
    if (res.ok) return { status: "renewed", session: (await res.json()) as AuthResponse };
    return { status: res.status === 409 ? "rotated" : "invalid" };
  } catch {
    return { status: "invalid" };
  }
}

/** Error con el formato del backend, para cuando el backend no responde. */
export function unavailableError(): ErrorResponse {
  return {
    mensaje: "El servicio no está disponible. Intentá de nuevo en unos minutos.",
    status: 503,
    timestamp: new Date().toISOString(),
    violations: null,
  };
}
