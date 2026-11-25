import type { NextRequest } from "next/server";
import type { AuthResponse, GoogleLoginRequest } from "@/types/api";
import { backendFetch } from "@/lib/server/backend";
import { clearGoogleOAuthState, readGoogleOAuthState, stateMatches } from "@/lib/server/google-oauth";
import { redirectTo } from "@/lib/server/route-helpers";
import { setSessionCookies } from "@/lib/server/session-cookies";
import type { GoogleLoginError } from "@/modules/auth/google-login-errors";

/**
 * Vuelta desde Google. Verifica el state, le pasa el código y el code verifier al
 * backend (que lo canjea con el client secret) y guarda la sesión en cookies httpOnly.
 * Esta URL (FRONTEND_URL + /api/auth/google/callback) se registra en Google Cloud.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const attempt = readGoogleOAuthState(request.cookies);

  const fail = (error: GoogleLoginError) => {
    const response = redirectTo(request, `/login?error=${error}`);
    clearGoogleOAuthState(response.cookies);
    return response;
  };

  // El usuario cerró la pantalla de Google o no dio permiso
  if (params.get("error")) return fail("google_cancelled");

  const code = params.get("code");
  if (!attempt || !code || !stateMatches(attempt.state, params.get("state"))) {
    return fail("google_failed");
  }

  const body: GoogleLoginRequest = { code, codeVerifier: attempt.codeVerifier };
  let res: Response;
  try {
    res = await backendFetch("/auth/google", { method: "POST", body });
  } catch {
    return fail("google_unavailable");
  }
  if (res.status === 503) return fail("google_unavailable");
  if (!res.ok) return fail("google_failed");

  const response = redirectTo(request, attempt.next);
  setSessionCookies(response.cookies, (await res.json()) as AuthResponse);
  clearGoogleOAuthState(response.cookies);
  return response;
}
