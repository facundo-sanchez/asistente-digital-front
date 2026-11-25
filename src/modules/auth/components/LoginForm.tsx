"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FormTextField } from "@/components/forms/FormTextField";
import { FormPasswordField } from "@/components/forms/FormPasswordField";
import { TextLink } from "@/components/common/TextLink";
import { applyApiErrors } from "@/lib/api/form-errors";
import { authApi } from "../api";
import { loginSchema, type LoginForm as LoginValues } from "../validation";
import type { LoginFormProps } from "./login-form-props";

export function LoginForm({ next, expired, initialError }: LoginFormProps) {
  const router = useRouter();
  const [error, setFormError] = useState<string | null>(initialError ?? null);
  const { control, handleSubmit, setError, formState } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await authApi.login(values);
      router.replace(next);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {expired && !error && <Alert severity="info">Tu sesión expiró. Ingresá de nuevo.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <FormTextField name="email" control={control} label="Email" type="email" autoComplete="email" autoFocus />
        <FormPasswordField name="password" control={control} label="Contraseña" autoComplete="current-password" />
        <Box sx={{ textAlign: "right", mt: -1 }}>
          <TextLink href="/forgot-password" variant="body2">
            ¿Olvidaste tu contraseña?
          </TextLink>
        </Box>
        <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
          Ingresar
        </Button>
      </Stack>
    </Box>
  );
}
