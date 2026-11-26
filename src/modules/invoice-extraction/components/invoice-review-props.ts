import type { InvoiceReviewResponse } from "@/types/api";
import type { ServiceOption } from "@/modules/documents/components/service-option";

export interface InvoiceReviewProps {
  review: InvoiceReviewResponse;
  services: ServiceOption[];
}
