/**
 * Login con Google desde el BFF: state (CSRF) + PKCE. El client secret y el canje del
 * código viven en el backend; acá solo se genera y se recuerda lo de este intento.
 * Solo servidor.
 */
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { BASE_PATH, safeNextPath } from "@/lib/config";
import type { CookieWriter } from "./cookie-writer";
import type { GoogleOAuthState } from "./google-oauth-state";
import { COOKIE_SECURE } from "./session-cookies";

const STATE_COOKIE = "adv_google_oauth";

/** Tiempo para elegir la cuenta en Google y volver. */
const STATE_MAX_AGE_SECONDS = 10 * 60;

/** Solo la reciben las rutas /api/auth/google/*. */
const STATE_COOKIE_PATH = `${BASE_PATH}/api/auth/google`;

export function createGoogleOAuthState(next: string | null): GoogleOAuthState {
  return {
    state: randomBytes(32).toString("base64url"),
    codeVerifier: randomBytes(32).toString("base64url"),
    next: safeNextPath(next),
  };
}

/** PKCE S256: SHA-256 del verifier, en base64url. */
export function codeChallengeOf(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

export function saveGoogleOAuthState(cookies: CookieWriter, value: GoogleOAuthState): void {
  cookies.set(STATE_COOKIE, JSON.stringify(value), cookieOptions(STATE_MAX_AGE_SECONDS));
}

export function clearGoogleOAuthState(cookies: CookieWriter): void {
  cookies.set(STATE_COOKIE, "", cookieOptions(0));
}

/** Lee la cookie del intento en curso. null si no existe o fue alterada. */
export function readGoogleOAuthState(cookies: { get(name: string): { value: string } | undefined }): GoogleOAuthState | null {
  const raw = cookies.get(STATE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<GoogleOAuthState>;
    if (typeof value.state !== "string" || typeof value.codeVerifier !== "string") return null;
    return { state: value.state, codeVerifier: value.codeVerifier, next: safeNextPath(value.next) };
  } catch {
    return null;
  }
}

/** Compara el state recibido con el guardado en tiempo constante. */
export function stateMatches(expected: string, received: string | null): boolean {
  if (!received) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && timingSafeEqual(a, b);
}

function cookieOptions(maxAge: number) {
  // Lax: el navegador la envía en la redirección de vuelta desde Google (GET de nivel superior)
  return { httpOnly: true, secure: COOKIE_SECURE, sameSite: "lax" as const, path: STATE_COOKIE_PATH, maxAge };
}
