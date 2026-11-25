/**
 * Validaciones de los formularios de autenticación y perfil.
 * Replican las del backend (RegisterRequest, PasswordRules, UpdateProfileRequest):
 * el backend vuelve a validar siempre.
 */
import * as yup from "yup";

export const PASSWORD_HINT = "Mínimo 8 caracteres, con al menos una letra y un número.";

const email = yup
  .string()
  .trim()
  .required("Ingresá tu email")
  .email("El email no es válido")
  .max(255);

export const newPassword = yup
  .string()
  .required("Ingresá una contraseña")
  .min(8, "Debe tener al menos 8 caracteres")
  .max(72, "Debe tener como máximo 72 caracteres")
  .matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Debe incluir al menos una letra y un número");

const confirm = (field: string) =>
  yup
    .string()
    .required("Repetí la contraseña")
    .oneOf([yup.ref(field)], "Las contraseñas no coinciden");

export const loginSchema = yup.object({
  email,
  password: yup.string().required("Ingresá tu contraseña").max(72),
});
export type LoginForm = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  name: yup.string().trim().required("Ingresá tu nombre").max(150),
  email,
  password: newPassword,
  confirmPassword: confirm("password"),
});
export type RegisterForm = yup.InferType<typeof registerSchema>;

export const forgotPasswordSchema = yup.object({ email });
export type ForgotPasswordForm = yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = yup.object({
  password: newPassword,
  confirmPassword: confirm("password"),
});
export type ResetPasswordForm = yup.InferType<typeof resetPasswordSchema>;

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required("Ingresá tu contraseña actual").max(72),
  newPassword,
  confirmPassword: confirm("newPassword"),
});
export type ChangePasswordForm = yup.InferType<typeof changePasswordSchema>;

/** Cuenta que solo entra con Google: crea su primera contraseña, sin indicar la actual. */
export const createPasswordSchema = yup.object({
  currentPassword: yup.string().defined(),
  newPassword,
  confirmPassword: confirm("newPassword"),
});

export const profileSchema = yup.object({
  name: yup.string().trim().required("Ingresá tu nombre").max(150),
  timezone: yup.string().required("Elegí una zona horaria"),
  locale: yup.string().required("Elegí un idioma"),
  defaultCurrency: yup
    .string()
    .required("Elegí una moneda")
    .matches(/^[A-Z]{3}$/, "Moneda inválida"),
});
export type ProfileForm = yup.InferType<typeof profileSchema>;
