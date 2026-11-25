"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { BILLING_FREQUENCIES, SERVICE_CATEGORIES, type ServiceRequest } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { CATEGORY_LABELS } from "@/lib/service-categories";
import { ProviderAutocomplete } from "@/modules/providers/components/ProviderAutocomplete";
import { servicesApi } from "../api";
import { serviceSchema, type ServiceFormValues } from "../validation";

/** Proveedor y categoría arrancan vacíos: los completa el usuario (o el proveedor elegido). */
const EMPTY: DefaultValues<ServiceFormValues> = {
  name: "",
  customerReference: "",
  billingFrequency: "MONTHLY",
  startDate: "",
  endDate: "",
  notes: "",
};

/** Del formulario al contrato del backend: los textos vacíos viajan como null. */
function toRequest(values: ServiceFormValues): ServiceRequest {
  return {
    providerId: values.provider.id,
    name: values.name,
    customerReference: values.customerReference || null,
    category: values.category,
    billingFrequency: values.billingFrequency,
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    notes: values.notes || null,
  };
}

/** Alta de un servicio (CU-001). Al guardar lleva al detalle del servicio nuevo. */
export function ServiceForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, setValue, getValues, formState } = useForm<ServiceFormValues>({
    resolver: yupResolver(serviceSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const created = await servicesApi.create(toRequest(values));
      router.push(`/services/${created.id}?created=1`);
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { providerId: "provider" }));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <Controller
          name="provider"
          control={control}
          render={({ field, fieldState }) => (
            <ProviderAutocomplete
              value={field.value ?? null}
              onChange={(provider) => {
                field.onChange(provider);
                // El proveedor sugiere la categoría y, si falta, el nombre
                if (provider) {
                  setValue("category", provider.category, { shouldValidate: true });
                  if (!getValues("name").trim()) setValue("name", provider.name, { shouldValidate: true });
                }
              }}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              helperText="Buscá tu empresa de luz, gas, agua, internet…"
              required
            />
          )}
        />

        <FormTextField<ServiceFormValues>
          name="name"
          control={control}
          label="Nombre del servicio"
          required
          helperText="Cómo lo vas a reconocer, ej. «Luz casa» o «Internet oficina»."
        />

        <FormTextField<ServiceFormValues>
          name="customerReference"
          control={control}
          label="Nro. de socio / cliente / suministro"
          helperText="Figura en tu factura. Con este número reconocemos las facturas de este servicio."
          slotProps={{ htmlInput: { inputMode: "text", autoComplete: "off" } }}
          sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.default" } }}
        />

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<ServiceFormValues> name="category" control={control} label="Categoría" select required>
            {SERVICE_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<ServiceFormValues> name="billingFrequency" control={control} label="Periodicidad" select required>
            {BILLING_FREQUENCIES.map((frequency) => (
              <MenuItem key={frequency} value={frequency}>
                {BILLING_FREQUENCY_LABELS[frequency]}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<ServiceFormValues>
            name="startDate"
            control={control}
            label="Desde (opcional)"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormTextField<ServiceFormValues>
            name="endDate"
            control={control}
            label="Hasta (opcional)"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <FormTextField<ServiceFormValues> name="notes" control={control} label="Notas (opcional)" multiline minRows={3} />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            Guardar servicio
          </Button>
          <Button component={NextLink} href="/services" size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
