import type { StatementReviewResponse } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface StatementReviewProps {
  review: StatementReviewResponse;
  /** Tarjetas activas del usuario. */
  cards: ServiceOption[];
}
