/** Backend: org.acme.asset.infrastructure.rest.dto */
import type { ISODate, ISODateTime, JsonObject, UUID } from "./common";

export const ASSET_TYPES = [
  "VEHICLE",
  "PROPERTY",
  "APPLIANCE",
  "ELECTRONICS",
  "OTHER",
] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export interface AssetResponse {
  id: UUID;
  name: string;
  assetType: AssetType;
  description: string | null;
  purchaseDate: ISODate | null;
  /** Patente, dirección, modelo... */
  metadata: JsonObject;
  active: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface AssetRequest {
  name: string;
  assetType: AssetType;
  description?: string | null;
  purchaseDate?: ISODate | null;
  metadata?: JsonObject | null;
}
