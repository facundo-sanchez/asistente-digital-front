"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch, type DefaultValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { OBLIGATION_TYPES, type ObligationRequest, type ObligationType, type RecurringFrequency, type RecurringRuleRequest } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { OBLIGATION_TYPE_LABELS } from "@/lib/obligation-labels";
import { obligationsApi, recurringRulesApi } from "../api";
import { OBLIGATION_CURRENCIES, RECURRING_FREQUENCIES, obligationSchema, parseAmount, type ObligationFormValues } from "../validation";
import type { ObligationFormProps } from "./obligation-form-props";

const EMPTY: DefaultValues<ObligationFormValues> = {
  title: "",
  obligationType: "OTHER",
  service: null,
  amount: "",
  currency: "ARS",
  dueDate: "",
  description: "",
  repeats: false,
  frequency: "MONTHLY",
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

/** Una repetición: el vencimiento elegido es el primero y su día del mes se repite. */
function toRuleRequest(values: ObligationFormValues): RecurringRuleRequest {
  const { title, obligationType, serviceId, amount, currency, dueDate } = toRequest(values);
  return {
    title,
    obligationType,
    serviceId: serviceId ?? null,
    frequency: values.frequency as RecurringFrequency,
    nextExpectedDate: dueDate,
    amount: amount ?? null,
    currency: currency ?? null,
  };
}

/** Alta (CU-005) o edición de una obligación, según venga obligation. Al guardar lleva al detalle. */
export function ObligationForm({ obligation, services, defaultService, rule }: ObligationFormProps) {
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
          repeats: false,
          frequency: "MONTHLY",
        }
      : rule
        ? {
            title: rule.title,
            obligationType: rule.obligationType,
            service: services.find((s) => s.id === rule.serviceId) ?? null,
            amount: rule.amount === null ? "" : String(rule.amount).replace(".", ","),
            currency: (rule.currency as ObligationFormValues["currency"]) ?? "ARS",
            dueDate: rule.nextExpectedDate,
            description: "",
            repeats: true,
            frequency: rule.frequency,
          }
        : { ...EMPTY, service: defaultService ?? null },
  });
  const repeats = useWatch({ control, name: "repeats" });
  const cancelHref = rule ? "/obligations" : obligation ? `/obligations/${obligation.id}` : defaultService ? `/services/${defaultService.id}` : "/obligations";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      if (rule) {
        await recurringRulesApi.update(rule.id, toRuleRequest(values));
        router.push("/obligations?recurring=updated");
      } else if (obligation) {
        await obligationsApi.update(obligation.id, toRequest(values));
        router.push(`/obligations/${obligation.id}?updated=1`);
      } else if (values.repeats) {
        await recurringRulesApi.create(toRuleRequest(values));
        router.push("/obligations?recurring=1");
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
            label={rule ? "Próximo vencimiento" : "Vence"}
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

        {/* La repetición se elige al crear; después se edita desde el detalle */}
        {!obligation && (
          <Box>
            {!rule && (
            <Controller
              name="repeats"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                  label="Se repite (alquiler, seguro, cuota…)"
                />
              )}
            />
            )}
            {repeats && (
              <FormTextField<ObligationFormValues>
                name="frequency"
                control={control}
                label="Cada cuánto"
                select
                helperText="Vence el mismo día de cada período. El próximo vencimiento aparece solo, 20 días antes."
                sx={{ mt: 2, maxWidth: { sm: 320 } }}
              >
                {RECURRING_FREQUENCIES.map((frequency) => (
                  <MenuItem key={frequency} value={frequency}>
                    {BILLING_FREQUENCY_LABELS[frequency]}
                  </MenuItem>
                ))}
              </FormTextField>
            )}
          </Box>
        )}

        {!repeats && (
          <FormTextField<ObligationFormValues> name="description" control={control} label="Notas (opcional)" multiline minRows={3} />
        )}

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            {obligation || rule ? "Guardar cambios" : "Guardar vencimiento"}
          </Button>
          <Button component={NextLink} href={cancelHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
