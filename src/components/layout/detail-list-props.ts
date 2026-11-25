import type { ReactNode } from "react";

export interface DetailListProps {
  /** Pares rótulo → valor, en el orden en que se muestran. */
  rows: [string, ReactNode][];
}
