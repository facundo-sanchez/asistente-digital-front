import { NextResponse, type NextRequest } from "next/server";
import type { GoogleAuthorizationRequest, GoogleAuthorizationResponse } from "@/types/api";
import { backendFetch } from "@/lib/server/backend";
import { callbackOrigin } from "@/lib/server/callback-origin";
import { codeChallengeOf, createGoogleOAuthState, saveGoogleOAuthState } from "@/lib/server/google-oauth";
import { publicOrigin } from "@/lib/server/public-origin";
import { redirectTo } from "@/lib/server/route-helpers";

/**
 * Inicio del login con Google ("Continuar con Google" es un enlace a esta ruta).
 * Genera state + PKCE, los guarda en una cookie httpOnly y redirige a Google.
 */
export async function GET(request: NextRequest) {
  const attempt = createGoogleOAuthState(request.nextUrl.searchParams.get("next"));
  const body: GoogleAuthorizationRequest = {
    state: attempt.state,
    codeChallenge: codeChallengeOf(attempt.codeVerifier),
  };

  let authorization: GoogleAuthorizationResponse;
  try {
    const res = await backendFetch("/auth/google/authorization", { method: "POST", body });
    if (!res.ok) return redirectTo(request, "/login?error=google_unavailable");
    authorization = (await res.json()) as GoogleAuthorizationResponse;
  } catch {
    return redirectTo(request, "/login?error=google_unavailable");
  }

  // Google vuelve a otra dirección que la de esta página: la cookie del intento no llegaría
  const origin = callbackOrigin(authorization.url);
  if (origin && origin !== publicOrigin(request)) return redirectTo(request, "/login?error=google_wrong_host");

  const response = NextResponse.redirect(authorization.url);
  saveGoogleOAuthState(response.cookies, attempt);
  return response;
}
