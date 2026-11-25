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
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DOCUMENT_TYPES, type DocumentType } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";
import { documentsApi } from "../api";
import { documentSchema, type DocumentFormValues } from "../validation";
import type { DocumentFormProps } from "./document-form-props";

/** Título, tipo, servicio y vencimiento de un documento. Al guardar vuelve al detalle. */
export function DocumentForm({ document, services }: DocumentFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, formState } = useForm<DocumentFormValues>({
    resolver: yupResolver(documentSchema),
    defaultValues: {
      title: document.title ?? "",
      documentType: document.documentType,
      service: services.find((s) => s.id === document.serviceId) ?? null,
      expiresOn: document.expiresOn ?? "",
    },
  });
  const detailHref = `/documents/${document.id}`;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      // Los textos vacíos viajan como null
      await documentsApi.update(document.id, {
        title: values.title || null,
        documentType: values.documentType as DocumentType,
        serviceId: values.service?.id ?? null,
        expiresOn: values.expiresOn || null,
      });
      router.push(`${detailHref}?updated=1`);
      router.refresh();
    } catch (e) {
      setFormError(applyApiErrors(e, setError, { serviceId: "service" }));
    }
  });

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Stack spacing={3}>
        {formError && <Alert severity="error">{formError}</Alert>}

        <FormTextField<DocumentFormValues>
          name="title"
          control={control}
          label="Título (opcional)"
          helperText={`Si lo dejás vacío se muestra el nombre del archivo: ${document.originalFilename}`}
        />

        <FormTextField<DocumentFormValues> name="documentType" control={control} label="Tipo" select required>
          {DOCUMENT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {DOCUMENT_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </FormTextField>

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
                  helperText={fieldState.error?.message ?? "A qué servicio corresponde, ej. la factura de «Luz casa»."}
                />
              )}
            />
          )}
        />

        <FormTextField<DocumentFormValues>
          name="expiresOn"
          control={control}
          label="Vence (opcional)"
          type="date"
          helperText="Para pólizas, garantías o facturas con fecha de vencimiento."
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ maxWidth: { sm: 280 } }}
        />

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={formState.isSubmitting}>
            Guardar cambios
          </Button>
          <Button component={NextLink} href={detailHref} size="large" color="inherit">
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
