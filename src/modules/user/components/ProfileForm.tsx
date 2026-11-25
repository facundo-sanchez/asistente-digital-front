"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { UserResponse } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { userApi } from "@/modules/auth/api";
import { profileSchema, type ProfileForm as ProfileValues } from "@/modules/auth/validation";
import { CURRENCY_OPTIONS, LOCALE_OPTIONS, timezoneOptions } from "../profile-options";

/** Datos personales y preferencias regionales. */
export function ProfileForm({ user }: { user: UserResponse }) {
  const router = useRouter();
  const timezones = useMemo(() => timezoneOptions(), []);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const { control, handleSubmit, setError, reset, formState } = useForm<ProfileValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      timezone: user.timezone,
      locale: user.locale,
      defaultCurrency: user.defaultCurrency,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setResult(null);
    try {
      const updated = await userApi.updateProfile(values);
      reset({
        name: updated.name,
        timezone: updated.timezone,
        locale: updated.locale,
        defaultCurrency: updated.defaultCurrency,
      });
      setResult({ ok: true, message: "Guardamos tus datos." });
      router.refresh();
    } catch (e) {
      setResult({ ok: false, message: applyApiErrors(e, setError) });
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={2.5}>
        {result && <Alert severity={result.ok ? "success" : "error"}>{result.message}</Alert>}
        <TextField label="Email" value={user.email} disabled helperText="El email no se puede cambiar." />
        <FormTextField name="name" control={control} label="Nombre" autoComplete="given-name" />
        <Controller
          name="timezone"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              options={timezones}
              value={field.value || null}
              onChange={(_, value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Zona horaria"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? "Se usa para calcular los vencimientos."}
                />
              )}
            />
          )}
        />
        <FormTextField name="locale" control={control} label="Idioma y formato" select>
          {LOCALE_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </FormTextField>
        <FormTextField name="defaultCurrency" control={control} label="Moneda principal" select>
          {CURRENCY_OPTIONS.map((o) => (
            <MenuItem key={o.value} value={o.value}>
              {o.label}
            </MenuItem>
          ))}
        </FormTextField>
        <Box>
          <Button type="submit" variant="contained" loading={formState.isSubmitting} disabled={!formState.isDirty}>
            Guardar cambios
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
