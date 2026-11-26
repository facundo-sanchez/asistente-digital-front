"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { InvoiceRequest } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { OBLIGATION_CURRENCIES, parseAmount } from "@/modules/obligations/validation";
import { invoicesApi } from "../api";
import { invoiceSchema, type InvoiceFormValues } from "../validation";
import { InvoiceDuplicateWarning } from "./InvoiceDuplicateWarning";
import type { InvoiceFormProps } from "./invoice-form-props";

/** Del formulario al contrato del backend: los textos vacíos viajan como null. */
function toRequest(values: InvoiceFormValues): InvoiceRequest {
  return {
    serviceId: values.service!.id,
    invoiceNumber: values.invoiceNumber || null,
    billingPeriod: values.billingPeriod || null,
    issueDate: values.issueDate || null,
    dueDate: values.dueDate,
    totalAmount: parseAmount(values.totalAmount)!,
    currency: values.currency,
    paymentCode: values.paymentCode || null,
  };
}

/**
 * Cargar una factura a mano (CU-002). Al guardar queda confirmada, genera su vencimiento
 * y lleva a él, listo para pagar.
 */
export function InvoiceForm({ services, defaultService }: InvoiceFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<InvoiceFormValues>({
    resolver: yupResolver(invoiceSchema),
    defaultValues: {
      // Sin servicio elegido el campo arranca vacío (DefaultValues admite undefined, no null)
      service: defaultService,
      invoiceNumber: "",
      billingPeriod: "",
      issueDate: "",
      dueDate: "",
      totalAmount: "",
      currency: "ARS",
      paymentCode: "",
    },
  });
  const [watchedService, watchedNumber, watchedPeriod, watchedAmount] = useWatch({
    control,
    name: ["service", "invoiceNumber", "billingPeriod", "totalAmount"],
  });
  const cancelHref = defaultService ? `/services/${defaultService.id}` : "/invoices";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const created = await invoicesApi.create(toRequest(values));
      router.push(created.obligationId ? `/obligations/${created.obligationId}?invoice=1` : "/invoices");
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { serviceId: "service" }));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}

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
                  label="Servicio"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message ?? (services.length === 0 ? "Primero registrá el servicio en Servicios." : "De qué servicio es, ej. «Luz casa».")}
                />
              )}
            />
          )}
        />

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<InvoiceFormValues> name="invoiceNumber" control={control} label="Número (opcional)" helperText="Ej. 0001-00001234" />
          <FormTextField<InvoiceFormValues> name="billingPeriod" control={control} label="Período (opcional)" helperText="Ej. 2026-12 o «noviembre-diciembre»" />
          <FormTextField<InvoiceFormValues>
            name="totalAmount"
            control={control}
            label="Importe"
            required
            slotProps={{ htmlInput: { inputMode: "decimal", autoComplete: "off" } }}
          />
          <FormTextField<InvoiceFormValues> name="currency" control={control} label="Moneda" select>
            {OBLIGATION_CURRENCIES.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<InvoiceFormValues> name="issueDate" control={control} label="Emitida (opcional)" type="date" slotProps={{ inputLabel: { shrink: true } }} />
          <FormTextField<InvoiceFormValues> name="dueDate" control={control} label="Vence" type="date" required slotProps={{ inputLabel: { shrink: true } }} />
        </Box>

        <InvoiceDuplicateWarning
          serviceId={watchedService?.id}
          invoiceNumber={watchedNumber ?? ""}
          billingPeriod={watchedPeriod ?? ""}
          totalAmount={watchedAmount ?? ""}
        />

        <FormTextField<InvoiceFormValues>
          name="paymentCode"
          control={control}
          label="Código de pago (opcional)"
          helperText="El código de barras o el de Pago Mis Cuentas / Link, para tenerlo a mano al pagar."
          slotProps={{ htmlInput: { autoComplete: "off" } }}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            Guardar factura
          </Button>
          <Button component={NextLink} href={cancelHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
