"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormPasswordField } from "@/components/forms/FormPasswordField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { authApi } from "@/modules/auth/api";
import {
  PASSWORD_HINT,
  changePasswordSchema,
  createPasswordSchema,
  type ChangePasswordForm as ChangePasswordValues,
} from "@/modules/auth/validation";
import type { ChangePasswordFormProps } from "./change-password-form-props";

const EMPTY: ChangePasswordValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

/**
 * Cambio de contraseña. El backend cierra las demás sesiones; esta sigue abierta.
 * Si la cuenta solo entra con Google, crea la primera contraseña (sin pedir la actual).
 */
export function ChangePasswordForm({ hasPassword }: ChangePasswordFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const { control, handleSubmit, setError, reset, formState } = useForm<ChangePasswordValues>({
    resolver: yupResolver(hasPassword ? changePasswordSchema : createPasswordSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setResult(null);
    try {
      await authApi.changePassword({ currentPassword: hasPassword ? currentPassword : null, newPassword });
      reset(EMPTY);
      setResult({
        ok: true,
        message: hasPassword
          ? "Cambiamos tu contraseña y cerramos tus otras sesiones."
          : "Creamos tu contraseña. Ya podés ingresar también con tu email.",
      });
      // Actualiza hasPassword en la página
      if (!hasPassword) router.refresh();
    } catch (e) {
      setResult({ ok: false, message: applyApiErrors(e, setError) });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {result && <Alert severity={result.ok ? "success" : "error"}>{result.message}</Alert>}
        {hasPassword && (
          <FormPasswordField
            name="currentPassword"
            control={control}
            label="Contraseña actual"
            autoComplete="current-password"
          />
        )}
        <FormPasswordField
          name="newPassword"
          control={control}
          label="Contraseña nueva"
          autoComplete="new-password"
          helperText={PASSWORD_HINT}
        />
        <FormPasswordField
          name="confirmPassword"
          control={control}
          label="Repetir contraseña nueva"
          autoComplete="new-password"
        />
        <Box>
          <Button type="submit" variant="contained" loading={formState.isSubmitting}>
            {hasPassword ? "Cambiar contraseña" : "Crear contraseña"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
