/** Utilidades de los route handlers del BFF. Solo servidor. */
import { NextResponse, type NextRequest } from "next/server";
import type { AuthResponse, SessionUserResponse } from "@/types/api";
import { withBasePath } from "@/lib/config";
import { backendFetch, unavailableError } from "./backend";
import { setSessionCookies } from "./session-cookies";

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

/** Devuelve al navegador la respuesta del backend tal cual (status + cuerpo JSON). */
export async function passthrough(res: Response): Promise<NextResponse> {
  if (res.status === 204 || res.status === 202) {
    return new NextResponse(null, { status: res.status });
  }
  const text = await res.text();
  return new NextResponse(text || null, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

/**
 * Redirección a una ruta interna de la app ("/login?error=x"). Agrega el basePath a mano:
 * en los route handlers, request.nextUrl no lo trae.
 */
export function redirectTo(request: NextRequest, pathWithQuery: string): NextResponse {
  return NextResponse.redirect(new URL(withBasePath(pathWithQuery), request.nextUrl.origin));
}

export function unavailable(): NextResponse {
  return NextResponse.json(unavailableError(), { status: 503 });
}

/** Llama al backend y responde passthrough; 503 si no hay conexión. */
export async function forward(path: string, body: unknown, accessToken?: string): Promise<NextResponse> {
  try {
    return await passthrough(await backendFetch(path, { method: "POST", body, accessToken }));
  } catch {
    return unavailable();
  }
}

/**
 * Para endpoints que emiten sesión (login, registro, cambio de contraseña):
 * guarda los tokens en cookies y al navegador le devuelve solo el usuario.
 */
export async function sessionResponse(call: () => Promise<Response>): Promise<NextResponse> {
  let res: Response;
  try {
    res = await call();
  } catch {
    return unavailable();
  }
  if (!res.ok) return passthrough(res);

  const session = (await res.json()) as AuthResponse;
  const body: SessionUserResponse = { user: session.user };
  const response = NextResponse.json(body, { status: res.status });
  setSessionCookies(response.cookies, session);
  return response;
}
