"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { authApi } from "../api";
import { forgotPasswordSchema, type ForgotPasswordForm as ForgotValues } from "../validation";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<ForgotValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await authApi.forgotPassword(values);
      setSentTo(values.email);
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  if (sentTo) {
    // Mismo mensaje exista o no la cuenta: no revela qué emails están registrados
    return (
      <Alert severity="success">
        Si existe una cuenta para <strong>{sentTo}</strong>, te enviamos un enlace para restablecer la
        contraseña. Revisá tu casilla (y la carpeta de spam). El enlace vence en 1 hora.
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormTextField name="email" control={control} label="Email" type="email" autoComplete="email" autoFocus />
        <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
          Enviar enlace
        </Button>
      </Stack>
    </Box>
  );
}
