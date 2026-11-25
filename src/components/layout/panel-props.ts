import type { ReactNode } from "react";

export interface PanelProps {
  title: string;
  /** Aclaración breve bajo el título. */
  description?: ReactNode;
  /** Acción del panel, alineada con el título. */
  action?: ReactNode;
  children: ReactNode;
}
