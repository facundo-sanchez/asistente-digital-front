/** Datos de un intento de login con Google, guardados en una cookie httpOnly hasta el callback. */
export interface GoogleOAuthState {
  /** Se compara con el state que devuelve Google (protección CSRF). */
  state: string;
  /** PKCE: secreto que prueba que quien canjea el código es quien inició el login. */
  codeVerifier: string;
  /** Ruta interna a la que volver después de iniciar sesión (ya validada). */
  next: string;
}
