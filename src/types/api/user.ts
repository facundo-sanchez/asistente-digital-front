/** Backend: org.acme.user.infrastructure.rest.dto */
import type { CurrencyCode, ISODateTime, UUID } from "./common";

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** GET /users/me */
export interface UserResponse {
  id: UUID;
  email: string;
  name: string;
  emailVerified: boolean;
  /** Zona IANA, ej. "America/Argentina/Buenos_Aires". */
  timezone: string;
  /** Ej. "es-AR". */
  locale: string;
  defaultCurrency: CurrencyCode;
  role: UserRole;
  createdAt: ISODateTime;
}

/** PUT /users/me */
export interface UpdateProfileRequest {
  name: string;
  timezone: string;
  locale: string;
  defaultCurrency: CurrencyCode;
}
