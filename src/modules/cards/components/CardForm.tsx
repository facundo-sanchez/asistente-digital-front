"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import { CARD_BRANDS, type CardBrand, type CardRequest } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { CARD_BRAND_LABELS } from "@/lib/card-brands";
import { parseAmount } from "@/modules/obligations/validation";
import { cardsApi } from "../api";
import { cardSchema, type CardFormValues } from "../validation";
import type { CardFormProps } from "./card-form-props";

/** Del formulario al contrato del backend: los textos vacíos viajan como null. */
function toRequest(values: CardFormValues): CardRequest {
  return {
    serviceId: values.service!.id,
    name: values.name,
    brand: values.brand as CardBrand,
    lastFour: values.lastFour || null,
    accountLastFour: values.accountLastFour || null,
    holderName: values.holderName || null,
    additional: values.additional,
    creditLimit: parseAmount(values.creditLimit),
  };
}

/** Alta o edición de una tarjeta. Cierre y vencimiento no se piden: los trae cada resumen. */
export function CardForm({ card, issuers, defaultIssuer }: CardFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<CardFormValues>({
    resolver: yupResolver(cardSchema),
    defaultValues: card
      ? {
          service: issuers.find((s) => s.id === card.serviceId) ?? { id: card.serviceId, name: card.serviceName ?? "" },
          name: card.name,
          brand: card.brand,
          lastFour: card.lastFour ?? "",
          accountLastFour: card.accountLastFour ?? "",
          holderName: card.holderName ?? "",
          additional: card.additional,
          creditLimit: card.creditLimit === null ? "" : String(card.creditLimit).replace(".", ","),
        }
      : { service: defaultIssuer, name: "", brand: "VISA", lastFour: "", accountLastFour: "", holderName: "", additional: false, creditLimit: "" },
  });
  const cancelHref = card ? `/cards/${card.id}` : "/cards";

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const saved = card ? await cardsApi.update(card.id, toRequest(values)) : await cardsApi.create(toRequest(values));
      router.push(`/cards/${saved.id}?${card ? "updated" : "created"}=1`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { serviceId: "service" }));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}
        {issuers.length === 0 && (
          <Alert severity="info">
            Primero registrá el banco o emisor como servicio de la categoría <strong>Tarjetas</strong>.{" "}
            <TextLink href="/services/new">Registrar servicio</TextLink>
          </Alert>
        )}

        <Controller
          name="service"
          control={control}
          render={({ field, fieldState }) => (
            <Autocomplete
              options={issuers}
              value={field.value ?? null}
              onChange={(_, service) => field.onChange(service)}
              onBlur={field.onBlur}
              getOptionLabel={(service) => service.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="No hay servicios de Tarjetas con ese nombre"
              renderInput={(params) => (
                <TextField {...params} label="Banco o emisor" required error={!!fieldState.error} helperText={fieldState.error?.message ?? "Tu servicio de la categoría Tarjetas, ej. «Galicia»."} />
              )}
            />
          )}
        />

        <FormTextField<CardFormValues> name="name" control={control} label="Nombre" required helperText="Cómo la vas a reconocer, ej. «Visa Galicia»." />

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <FormTextField<CardFormValues> name="brand" control={control} label="Marca" select required>
            {CARD_BRANDS.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {CARD_BRAND_LABELS[brand]}
              </MenuItem>
            ))}
          </FormTextField>
          <FormTextField<CardFormValues>
            name="lastFour"
            control={control}
            label="Terminación (opcional)"
            helperText="Últimos 4 números de la tarjeta."
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 4, autoComplete: "off" } }}
          />
          <FormTextField<CardFormValues>
            name="accountLastFour"
            control={control}
            label="Cuenta (opcional)"
            helperText="Últimos 4 de la cuenta, si tu banco la informa en el resumen."
            slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 4, autoComplete: "off" } }}
          />
          <FormTextField<CardFormValues>
            name="creditLimit"
            control={control}
            label="Límite (opcional)"
            slotProps={{ htmlInput: { inputMode: "decimal", autoComplete: "off" } }}
          />
        </Box>

        <FormTextField<CardFormValues> name="holderName" control={control} label="Titular (opcional)" />
        <Controller
          name="additional"
          control={control}
          render={({ field }) => (
            <FormControlLabel control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Es una tarjeta adicional" />
          )}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            {card ? "Guardar cambios" : "Guardar tarjeta"}
          </Button>
          <Button component={NextLink} href={cancelHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
