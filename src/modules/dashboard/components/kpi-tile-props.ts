import type { ReactNode } from "react";

export interface KpiTileProps {
  label: string;
  /** El número o importe principal. */
  value: ReactNode;
  /** Aclaración debajo (ej. el importe en dólares o la cantidad). */
  detail?: ReactNode;
  /** A dónde lleva (el listado filtrado). */
  href: string;
  /** Resalta el indicador (ej. hay vencidos). */
  alert?: boolean;
}
