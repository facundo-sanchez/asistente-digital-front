import type { CardResponse } from "@/types/api";
import type { ReportQuery } from "../report-query";

export interface ReportFiltersProps {
  query: ReportQuery;
  /** Período que usó el backend ("yyyy-MM"), para cuando la URL no trae meses. */
  from: string;
  to: string;
  cards: CardResponse[];
  /** Adónde se envía el formulario ("" = la misma página). */
  action: string;
}
