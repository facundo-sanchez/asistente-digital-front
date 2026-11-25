import { NextResponse, type NextRequest } from "next/server";
import type { AuthResponse } from "@/types/api";
import { backendFetch, refreshSession } from "@/lib/server/backend";
import { readJson, sessionResponse } from "@/lib/server/route-helpers";
import { ACCESS_COOKIE, REFRESH_COOKIE, setSessionCookies } from "@/lib/server/session-cookies";

/**
 * Cambia la contraseña. El backend cierra las demás sesiones y emite una nueva,
 * que se guarda en cookies. Pasa por acá (y no por /api/backend) porque la
 * respuesta del backend trae tokens.
 */
export async function PUT(request: NextRequest) {
  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  let renewed: AuthResponse | null = null;

  // Access token vencido (pantalla abierta más de 15 min): se renueva antes de seguir
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!accessToken && refreshToken) {
    const result = await refreshSession(refreshToken);
    if (result.status === "renewed") {
      renewed = result.session;
      accessToken = renewed.accessToken;
    }
  }
  if (!accessToken) {
    return NextResponse.json(
      { mensaje: "La sesión expiró", status: 401, timestamp: new Date().toISOString(), violations: null },
      { status: 401 },
    );
  }

  const body = await readJson(request);
  const response = await sessionResponse(() =>
    backendFetch("/users/me/password", { method: "PUT", body, accessToken }),
  );
  // Si el cambio falla (ej. contraseña actual incorrecta) igual hay que guardar la sesión
  // renovada: el refresh token anterior ya no sirve.
  if (renewed && !response.ok) setSessionCookies(response.cookies, renewed);
  return response;
}
