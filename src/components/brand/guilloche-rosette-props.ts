export interface GuillocheRosetteProps {
  /** Fracción pagada (0 a 1). null: sin datos, solo se dibuja el guilloché. */
  value: number | null;
  /** Lado en píxeles, o un tamaño CSS (ej. "100%") para que siga a su contenedor. */
  size?: number | string;
  /** Texto para lectores de pantalla. Sin label la roseta es decorativa. */
  label?: string;
  /** Color de los trazos del guilloché. Por defecto, el texto secundario del tema. */
  lineColor?: string;
  /** Color del arco de progreso. Por defecto, el primario del tema. */
  arcColor?: string;
}
