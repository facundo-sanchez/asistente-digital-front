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
import { applyApiErrors } from "@/lib/api/form-errors";
import { HOME_PATH } from "@/lib/config";
import { authApi } from "../api";
import { PASSWORD_HINT, registerSchema, type RegisterForm as RegisterValues } from "../validation";

export function RegisterForm() {
  const router = useRouter();
  const [error, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setFormError(null);
    try {
      await authApi.register({ name, email, password });
      router.replace(HOME_PATH);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        <FormTextField name="name" control={control} label="Nombre" autoComplete="given-name" autoFocus />
        <FormTextField name="email" control={control} label="Email" type="email" autoComplete="email" />
        <FormPasswordField
          name="password"
          control={control}
          label="Contraseña"
          autoComplete="new-password"
          helperText={PASSWORD_HINT}
        />
        <FormPasswordField
          name="confirmPassword"
          control={control}
          label="Repetir contraseña"
          autoComplete="new-password"
        />
        <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
          Crear cuenta
        </Button>
      </Stack>
    </Box>
  );
}
