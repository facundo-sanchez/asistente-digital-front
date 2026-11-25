import type { AuthResponse } from "@/types/api";

/**
 * Resultado de renovar la sesión.
 * - renewed: sesión nueva, hay que guardarla en cookies.
 * - rotated: otro pedido (otra pestaña, llamada en paralelo) acaba de renovar con el mismo
 *   token. La sesión sigue viva con las cookies que trae ese otro pedido: NO borrarlas.
 * - invalid: el refresh token no sirve; hay que volver a iniciar sesión.
 */
export type RefreshResult =
  | { status: "renewed"; session: AuthResponse }
  | { status: "rotated" }
  | { status: "invalid" };
