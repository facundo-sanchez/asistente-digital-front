import type { NextRequest } from "next/server";
import type { GmailConnectRequest } from "@/types/api";
import { backendFetch } from "@/lib/server/backend";
import { clearGoogleOAuthState, GMAIL_OAUTH, readGoogleOAuthState, stateMatches } from "@/lib/server/google-oauth";
import { redirectTo } from "@/lib/server/route-helpers";
import { ACCESS_COOKIE } from "@/lib/server/session-cookies";

/**
 * Vuelta desde Google al conectar Gmail. Verifica el state y le pasa al backend el código, el code verifier
 * y desde cuándo importar. Esta URL (FRONTEND_URL + /api/integrations/gmail/callback) se registra en Google Cloud.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const attempt = readGoogleOAuthState(request.cookies, GMAIL_OAUTH);

  const finish = (result: "connected" | "cancelled" | "failed" | "unavailable") => {
    const response = redirectTo(request, `/integrations?gmail=${result}`);
    clearGoogleOAuthState(response.cookies, GMAIL_OAUTH);
    return response;
  };

  // El usuario cerró la pantalla de Google o no dio permiso
  if (params.get("error")) return finish("cancelled");

  const code = params.get("code");
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!attempt || !code || !accessToken || !stateMatches(attempt.state, params.get("state"))) return finish("failed");

  const syncFrom = new URL(attempt.next, "http://local").searchParams.get("syncFrom");
  const body: GmailConnectRequest = { code, codeVerifier: attempt.codeVerifier, syncFrom: syncFrom || null };
  try {
    const res = await backendFetch("/integrations/gmail", { method: "POST", body, accessToken });
    if (res.status === 503) return finish("unavailable");
    return finish(res.ok ? "connected" : "failed");
  } catch {
    return finish("unavailable");
  }
}
