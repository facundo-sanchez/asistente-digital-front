import type { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  /** Una línea de contexto bajo el título. */
  description?: ReactNode;
  /** Acción principal de la página, a la derecha del título. */
  action?: ReactNode;
}
