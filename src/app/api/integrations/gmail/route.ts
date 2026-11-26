import { NextResponse, type NextRequest } from "next/server";
import type { AuthorizationUrlResponse, GmailAuthorizationRequest } from "@/types/api";
import { backendFetch } from "@/lib/server/backend";
import { codeChallengeOf, createGoogleOAuthState, GMAIL_OAUTH, saveGoogleOAuthState } from "@/lib/server/google-oauth";
import { redirectTo } from "@/lib/server/route-helpers";
import { ACCESS_COOKIE } from "@/lib/server/session-cookies";

/** Meses hacia atrás que se pueden importar; sin from (o "new"), solo los correos nuevos. */
const MONTHS = new Set(["3", "6", "12"]);

/**
 * Inicio de "Conectar Gmail" (el botón es un enlace a esta ruta con ?from=new|3|6|12).
 * Genera state + PKCE, los guarda en una cookie httpOnly y redirige a Google.
 * "Desde cuándo" viaja en la cookie (como parte de la ruta de vuelta) hasta el callback.
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return redirectTo(request, "/login?next=/integrations");

  const from = request.nextUrl.searchParams.get("from") ?? "new";
  const attempt = createGoogleOAuthState(MONTHS.has(from) ? `/integrations?syncFrom=${monthsAgo(Number(from))}` : "/integrations");
  const body: GmailAuthorizationRequest = { state: attempt.state, codeChallenge: codeChallengeOf(attempt.codeVerifier) };

  let authorization: AuthorizationUrlResponse;
  try {
    const res = await backendFetch("/integrations/gmail/authorization", { method: "POST", body, accessToken });
    if (res.status === 401) return redirectTo(request, "/login?next=/integrations");
    if (!res.ok) return redirectTo(request, "/integrations?gmail=unavailable");
    authorization = (await res.json()) as AuthorizationUrlResponse;
  } catch {
    return redirectTo(request, "/integrations?gmail=unavailable");
  }

  const response = NextResponse.redirect(authorization.authorizationUrl);
  saveGoogleOAuthState(response.cookies, attempt, GMAIL_OAUTH);
  return response;
}

function monthsAgo(months: number): string {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - months);
  return date.toISOString().slice(0, 10);
}
