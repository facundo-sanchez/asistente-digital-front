/** Backend: org.acme.user.infrastructure.rest.dto */
import type { CurrencyCode, ISODateTime, UUID } from "./common";

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PAYMENT_WALLETS = ["MERCADO_PAGO", "MODO", "CUENTA_DNI"] as const;
export type PaymentWallet = (typeof PAYMENT_WALLETS)[number];

/** PUT /users/me/payment-wallet */
export interface PaymentWalletRequest {
  paymentWallet: PaymentWallet | null;
}

export const PRICE_INCREASE_THRESHOLDS = [10, 20, 30, 50] as const;
export type PriceIncreaseThreshold = (typeof PRICE_INCREASE_THRESHOLDS)[number];

/** GET /users/me */
export interface UserResponse {
  id: UUID;
  email: string;
  name: string;
  emailVerified: boolean;
  /** false si la cuenta solo entra con Google: puede crear una contraseña sin indicar la actual. */
  hasPassword: boolean;
  /** Zona IANA, ej. "America/Argentina/Buenos_Aires". */
  timezone: string;
  /** Ej. "es-AR". */
  locale: string;
  defaultCurrency: CurrencyCode;
  role: UserRole;
  /** Billetera para pagar facturas; null si no eligió ninguna. */
  paymentWallet: PaymentWallet | null;
  /** Desde qué % de aumento de una factura se avisa. */
  priceIncreaseThreshold: PriceIncreaseThreshold;
  createdAt: ISODateTime;
}

/** PUT /users/me */
export interface UpdateProfileRequest {
  name: string;
  timezone: string;
  locale: string;
  defaultCurrency: CurrencyCode;
}

// ----------------------------------------------------------------------------
// Autenticación (/auth). Política de contraseña: 8 a 72 caracteres, al menos
// una letra y un número (PasswordRules en el backend).
// ----------------------------------------------------------------------------

/** POST /auth/register */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** POST /auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** POST /auth/refresh y /auth/logout. Solo lo usa el BFF (servidor de Next). */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/** POST /auth/verify-email */
export interface TokenRequest {
  token: string;
}

/** POST /auth/forgot-password (responde 202 siempre) */
export interface ForgotPasswordRequest {
  email: string;
}

/** POST /auth/reset-password */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/** PUT /users/me/password */
export interface ChangePasswordRequest {
  /** Obligatoria si la cuenta ya tiene contraseña. */
  currentPassword?: string | null;
  newPassword: string;
}

/**
 * Sesión emitida por el backend. SOLO se maneja en el servidor de Next (BFF):
 * los tokens se guardan en cookies httpOnly y nunca llegan al navegador.
 */
export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  /** Segundos. */
  expiresIn: number;
  refreshToken: string;
  /** Segundos. */
  refreshExpiresIn: number;
  user: UserResponse;
}

/** Respuesta de las rutas /api/auth/* del BFF hacia el navegador (sin tokens). */
export interface SessionUserResponse {
  user: UserResponse;
}

// ----------------------------------------------------------------------------
// Login con Google (/auth/google). Solo lo usa el BFF.
// ----------------------------------------------------------------------------

/** POST /auth/google/authorization */
export interface GoogleAuthorizationRequest {
  /** Valor aleatorio base64url que Google devuelve en el callback (CSRF). */
  state: string;
  /** PKCE: SHA-256 del code verifier, en base64url (43 caracteres). */
  codeChallenge: string;
}

/** Respuesta de POST /auth/google/authorization */
export interface GoogleAuthorizationResponse {
  /** URL de Google a la que redirigir al usuario. */
  url: string;
}

/** POST /auth/google (responde AuthResponse) */
export interface GoogleLoginRequest {
  code: string;
  codeVerifier: string;
}
