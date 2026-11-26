/** Solo servidor. */

/**
 * Origen al que Google va a volver: el del redirect_uri de la URL de autorización.
 * La cookie del intento se guarda en el origen donde empezó; si Google vuelve a otro
 * (ej. se entró por 192.168.1.6 y vuelve a localhost), el navegador no la manda y el intento falla.
 */
export function callbackOrigin(authorizationUrl: string): string | null {
  try {
    const redirectUri = new URL(authorizationUrl).searchParams.get("redirect_uri");
    return redirectUri ? new URL(redirectUri).origin : null;
  } catch {
    return null;
  }
}
