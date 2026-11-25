import { NextResponse, type NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { REFRESH_COOKIE, clearSessionCookies } from "@/lib/server/session-cookies";

/** Cierra la sesión: invalida el refresh token en el backend y borra las cookies. */
export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    // Si el backend no responde igual se borran las cookies
    await backendFetch("/auth/logout", { method: "POST", body: { refreshToken } }).catch(() => undefined);
  }
  const response = new NextResponse(null, { status: 204 });
  clearSessionCookies(response.cookies);
  return response;
}
