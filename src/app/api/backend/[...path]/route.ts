/**
 * BFF genérico: reenvía al backend las llamadas del navegador agregando el access
 * token de la cookie. Si el token venció, renueva la sesión y reintenta una vez.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { AuthResponse } from "@/types/api";
import { backendFetch, refreshSession } from "@/lib/server/backend";
import { unavailable } from "@/lib/server/route-helpers";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearSessionCookies,
  setSessionCookies,
} from "@/lib/server/session-cookies";

interface Context {
  params: Promise<{ path: string[] }>;
}

/**
 * Rutas del backend que devuelven tokens en el cuerpo: nunca se exponen por este
 * proxy (tienen su propio route handler en /api/auth).
 */
function isBlocked(path: string): boolean {
  if (path === "auth/resend-verification") return false;
  return path.startsWith("auth/") || path === "users/me/password";
}

async function handler(request: NextRequest, { params }: Context) {
  const segments = (await params).path;
  if (segments.some((s) => s === ".." || s === "." || s === "")) {
    return NextResponse.json({ mensaje: "Ruta inválida", status: 400 }, { status: 400 });
  }
  const path = segments.map(encodeURIComponent).join("/");
  if (isBlocked(path)) {
    return NextResponse.json({ mensaje: "Not Found", status: 404 }, { status: 404 });
  }

  const method = request.method;
  const hasBody = !["GET", "HEAD"].includes(method);
  const rawBody = hasBody ? await request.arrayBuffer() : null;
  const contentType = request.headers.get("Content-Type");
  const target = `/${path}${request.nextUrl.search}`;

  let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  let renewed: AuthResponse | null = null;

  const call = (token?: string) =>
    backendFetch(target, {
      method,
      rawBody: rawBody && rawBody.byteLength > 0 ? rawBody : null,
      contentType,
      accessToken: token,
    });

  let res: Response;
  try {
    if (!accessToken && refreshToken) {
      renewed = await refreshSession(refreshToken);
      accessToken = renewed?.accessToken;
    }
    res = await call(accessToken);
    if (res.status === 401 && refreshToken && !renewed) {
      renewed = await refreshSession(refreshToken);
      if (renewed) res = await call(renewed.accessToken);
    }
  } catch {
    return unavailable();
  }

  const body = res.status === 204 ? null : await res.arrayBuffer();
  const response = new NextResponse(body, {
    status: res.status,
    headers: res.headers.get("Content-Type") ? { "Content-Type": res.headers.get("Content-Type")! } : {},
  });

  if (renewed) {
    setSessionCookies(response.cookies, renewed);
  } else if (res.status === 401) {
    clearSessionCookies(response.cookies);
  }
  return response;
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
