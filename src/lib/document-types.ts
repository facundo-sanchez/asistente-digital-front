/** Tipos de documento (los mismos del backend) con su nombre en español. */
import type { DocumentType } from "@/types/api";

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  INVOICE: "Factura",
  CARD_STATEMENT: "Resumen de tarjeta",
  PAYMENT_RECEIPT: "Comprobante de pago",
  POLICY: "Póliza",
  CONTRACT: "Contrato",
  PERSONAL_ID: "Documento personal",
  OTHER: "Otro",
};
