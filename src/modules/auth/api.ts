/** Llamadas de autenticación y perfil (módulo Auth + Usuario). */
import { api, bffRequest } from "@/lib/api/client";
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  PaymentWalletRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SessionUserResponse,
  TokenRequest,
  UpdateProfileRequest,
  UserResponse,
} from "@/types/api";

export const authApi = {
  login: (body: LoginRequest) => bffRequest<SessionUserResponse>("POST", "auth/login", body),
  register: (body: RegisterRequest) => bffRequest<SessionUserResponse>("POST", "auth/register", body),
  logout: () => bffRequest<void>("POST", "auth/logout"),
  forgotPassword: (body: ForgotPasswordRequest) => bffRequest<void>("POST", "auth/forgot-password", body),
  resetPassword: (body: ResetPasswordRequest) => bffRequest<void>("POST", "auth/reset-password", body),
  verifyEmail: (body: TokenRequest) => bffRequest<void>("POST", "auth/verify-email", body),
  changePassword: (body: ChangePasswordRequest) =>
    bffRequest<SessionUserResponse>("PUT", "auth/change-password", body),
  resendVerification: () => api.post<void>("auth/resend-verification"),
};

export const userApi = {
  me: () => api.get<UserResponse>("users/me"),
  updateProfile: (body: UpdateProfileRequest) => api.put<UserResponse>("users/me", body),
  setPaymentWallet: (body: PaymentWalletRequest) => api.put<UserResponse>("users/me/payment-wallet", body),
  setEmailCheckInterval: (interval: string) => api.put<UserResponse>("users/me/email-check-interval", { interval }),
  setPriceIncreaseThreshold: (threshold: number) => api.put<UserResponse>("users/me/price-increase-threshold", { threshold }),
};
