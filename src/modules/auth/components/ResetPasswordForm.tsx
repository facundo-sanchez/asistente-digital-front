"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormPasswordField } from "@/components/forms/FormPasswordField";
import { TextLink } from "@/components/common/TextLink";
import { applyApiErrors } from "@/lib/api/form-errors";
import { authApi } from "../api";
import { PASSWORD_HINT, resetPasswordSchema, type ResetPasswordForm as ResetValues } from "../validation";

export function ResetPasswordForm({ token }: { token: string }) {
  const [done, setDone] = useState(false);
  const [error, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<ResetValues>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ password }) => {
    setFormError(null);
    try {
      await authApi.resetPassword({ token, newPassword: password });
      setDone(true);
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { newPassword: "password" }));
    }
  });

  if (done) {
    return (
      <Stack spacing={2}>
        <Alert severity="success">
          Listo, tu contraseña cambió. Por seguridad cerramos todas tus sesiones abiertas.
        </Alert>
        <TextLink href="/login">Ir a iniciar sesión</TextLink>
      </Stack>
    );
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && (
          <Alert severity="error">
            {error} <TextLink href="/forgot-password">Pedir un enlace nuevo</TextLink>
          </Alert>
        )}
        <FormPasswordField
          name="password"
          control={control}
          label="Contraseña nueva"
          autoComplete="new-password"
          helperText={PASSWORD_HINT}
          autoFocus
        />
        <FormPasswordField
          name="confirmPassword"
          control={control}
          label="Repetir contraseña"
          autoComplete="new-password"
        />
        <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
          Guardar contraseña
        </Button>
      </Stack>
    </Box>
  );
}
