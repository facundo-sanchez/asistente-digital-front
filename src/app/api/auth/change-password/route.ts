import { NextResponse, type NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { readJson, sessionResponse } from "@/lib/server/route-helpers";
import { ACCESS_COOKIE } from "@/lib/server/session-cookies";

/**
 * Cambia la contraseña. El backend cierra las demás sesiones y emite una nueva,
 * que se guarda en cookies. Pasa por acá (y no por /api/backend) porque la
 * respuesta del backend trae tokens.
 */
export async function PUT(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return NextResponse.json(
      { mensaje: "La sesión expiró", status: 401, timestamp: new Date().toISOString(), violations: null },
      { status: 401 },
    );
  }
  const body = await readJson(request);
  return sessionResponse(() =>
    backendFetch("/users/me/password", { method: "PUT", body, accessToken }),
  );
}
