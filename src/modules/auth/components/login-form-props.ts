export interface LoginFormProps {
  /** Ruta a la que volver después de iniciar sesión (ya validada). */
  next: string;
  /** La sesión anterior expiró o fue cerrada. */
  expired?: boolean;
}
