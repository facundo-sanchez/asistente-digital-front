/**
 * Errores del login con Google. El callback del BFF redirige a /login?error=<código>
 * y la página muestra el mensaje. Solo códigos fijos: nunca texto libre en la URL.
 */
export const GOOGLE_LOGIN_ERRORS = {
  google_cancelled: "Cancelaste el inicio de sesión con Google.",
  google_unavailable: "El inicio de sesión con Google no está disponible en este momento.",
  google_failed: "No pudimos iniciar sesión con Google. Probá de nuevo o ingresá con tu email.",
} as const;

export type GoogleLoginError = keyof typeof GOOGLE_LOGIN_ERRORS;

export function googleLoginErrorMessage(code: string | undefined): string | undefined {
  return code && code in GOOGLE_LOGIN_ERRORS ? GOOGLE_LOGIN_ERRORS[code as GoogleLoginError] : undefined;
}
