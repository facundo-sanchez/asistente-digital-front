"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { OBLIGATION_TYPES, type ObligationRequest, type ObligationType } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { OBLIGATION_TYPE_LABELS } from "@/lib/obligation-labels";
import { obligationsApi } from "../api";
import { OBLIGATION_CURRENCIES, obligationSchema, parseAmount, type ObligationFormValues } from "../validation";
import type { ObligationFormProps } from "./obligation-form-props";

const EMPTY: DefaultValues<ObligationFormValues> = {
  title: "",
  obligationType: "OTHER",
  service: null,
  amount: "",
  currency: "ARS",
  dueDate: "",
  description: "",
};

/** Del formulario al contrato del backend: sin importe tampoco viaja la moneda. */
function toRequest(values: ObligationFormValues): ObligationRequest {
  const amount = parseAmount(values.amount);
  return {
    title: values.title,
    obligationType: values.obligationType as ObligationType,
    serviceId: values.service?.id ?? null,
    amount,
    currency: amount === null ? null : values.currency,
    dueDate: values.dueDate,
    description: values.description || null,
  };
}

/** Alta (CU-005) o edición de una obligación, según venga obligation. Al guardar lleva al detalle. */
export function ObligationForm({ obligation, services, defaultService }: ObligationFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<ObligationFormValues>({
    resolver: yupResolver(obligationSchema),
    defaultValues: obligation
      ? {
          title: obligation.title,
          obligationType: obligation.obligationType,
          service: services.find((s) => s.id === obligation.serviceId) ?? null,
          amount: obligation.amount === null ? "" : String(obligation.amount).replace(".", ","),
          currency: (obligation.currency as ObligationFormValues["currency"]) ?? "ARS",
          dueDate: obligation.dueDate,
          description: obligation.description ?? "",
        }
      : { ...EMPTY, service: defaultService ?? null },
  });
  const cancelHref = obligation ? `/obligations/${obligation.id}` : defaultService ? `/services/${defaultService.id}` : "/obligations";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      if (obligation) {
        await obligationsApi.update(obligation.id, toRequest(values));
        router.push(`/obligations/${obligation.id}?updated=1`);
      } else {
        const created = await obligationsApi.create(toRequest(values));
        router.push(`/obligations/${created.id}?created=1`);
      }
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { serviceId: "service" }));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <FormTextField<ObligationFormValues>
          name="title"
          control={control}
          label="Título"
          required
          helperText="Cómo lo vas a reconocer, ej. «VTV auto» o «Seguro hogar»."
        />

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<ObligationFormValues> name="obligationType" control={control} label="Tipo" select required>
            {OBLIGATION_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {OBLIGATION_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<ObligationFormValues>
            name="dueDate"
            control={control}
            label="Vence"
            type="date"
            required
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormTextField<ObligationFormValues>
            name="amount"
            control={control}
            label="Importe (opcional)"
            helperText="Si todavía no lo sabés, dejalo vacío."
            slotProps={{ htmlInput: { inputMode: "decimal", autoComplete: "off" } }}
          />
          <FormTextField<ObligationFormValues> name="currency" control={control} label="Moneda" select>
            {OBLIGATION_CURRENCIES.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}
              </MenuItem>
            ))}
          </FormTextField>
        </Box>

        <Controller
          name="service"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              options={services}
              value={field.value ?? null}
              onChange={(_, service) => field.onChange(service)}
              onBlur={field.onBlur}
              getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="No hay servicios con ese nombre"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Servicio (opcional)"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? "Si corresponde a un servicio, ej. la luz de «Luz casa»."}
                />
              )}
            />
          )}
        />

        <FormTextField<ObligationFormValues> name="description" control={control} label="Notas (opcional)" multiline minRows={3} />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            {obligation ? "Guardar cambios" : "Guardar vencimiento"}
          </Button>
          <Button component={NextLink} href={cancelHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
