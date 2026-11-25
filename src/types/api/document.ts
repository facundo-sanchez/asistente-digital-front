/** Backend: org.acme.document.infrastructure.rest.dto */
import type {
  DocumentType,
  ISODate,
  ISODateTime,
  JsonObject,
  UUID,
} from "./common";

export const DOCUMENT_SOURCES = ["MANUAL", "GMAIL", "INTEGRATION"] as const;
export type DocumentSource = (typeof DOCUMENT_SOURCES)[number];

export const PROCESSING_STATUSES = [
  "NOT_REQUIRED",
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REQUIRES_REVIEW",
] as const;
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

/** DEAD = superó el máximo de intentos. */
export const PROCESSING_JOB_STATUSES = [
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REQUIRES_REVIEW",
  "DEAD",
] as const;
export type ProcessingJobStatus = (typeof PROCESSING_JOB_STATUSES)[number];

export const EXTRACTION_VALIDATION_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CORRECTED",
  "REJECTED",
] as const;
export type ExtractionValidationStatus =
  (typeof EXTRACTION_VALIDATION_STATUSES)[number];

/** GET /documents, GET /documents/{id}. El archivo se baja por GET /documents/{id}/download. */
export interface DocumentResponse {
  id: UUID;
  serviceId: UUID | null;
  assetId: UUID | null;
  obligationId: UUID | null;
  documentType: DocumentType;
  title: string | null;
  originalFilename: string;
  mimeType: string;
  /** Bytes. */
  fileSize: number;
  source: DocumentSource;
  processingStatus: ProcessingStatus;
  expiresOn: ISODate | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** PUT /documents/{id} (metadatos). La carga del archivo es multipart en POST /documents/upload. */
export interface DocumentUpdateRequest {
  title?: string | null;
  documentType: DocumentType;
  serviceId?: UUID | null;
  assetId?: UUID | null;
  obligationId?: UUID | null;
  expiresOn?: ISODate | null;
}

/** GET /documents/{id}/processing */
export interface ProcessingJobResponse {
  id: UUID;
  documentId: UUID;
  status: ProcessingJobStatus;
  attempts: number;
  maxAttempts: number;
  errorCode: string | null;
  startedAt: ISODateTime | null;
  createdAt: ISODateTime;
  completedAt: ISODateTime | null;
}

/** Propuesta de la IA para revisar antes de confirmar. */
export interface ExtractionResultResponse {
  id: UUID;
  documentId: UUID;
  model: string;
  schemaVersion: string;
  detectedType: DocumentType | null;
  /** Depende de schemaVersion / detectedType (provider, invoiceNumber, dueDate, amount...). */
  extractedData: JsonObject;
  /** Confianza por campo, de 0 a 1. */
  confidenceData: Record<string, number>;
  validationStatus: ExtractionValidationStatus;
  createdAt: ISODateTime;
  reviewedAt: ISODateTime | null;
}
