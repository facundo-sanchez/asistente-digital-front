"use client";

import { useState } from "react";
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
  type ChangePasswordForm as ChangePasswordValues,
} from "@/modules/auth/validation";

const EMPTY: ChangePasswordValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

/** Cambio de contraseña. El backend cierra las demás sesiones; esta sigue abierta. */
export function ChangePasswordForm() {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const { control, handleSubmit, setError, reset, formState } = useForm<ChangePasswordValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async ({ currentPassword, newPassword }) => {
    setResult(null);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      reset(EMPTY);
      setResult({ ok: true, message: "Cambiamos tu contraseña y cerramos tus otras sesiones." });
    } catch (e) {
      setResult({ ok: false, message: applyApiErrors(e, setError) });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {result && <Alert severity={result.ok ? "success" : "error"}>{result.message}</Alert>}
        <FormPasswordField
          name="currentPassword"
          control={control}
          label="Contraseña actual"
          autoComplete="current-password"
        />
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
            Cambiar contraseña
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
