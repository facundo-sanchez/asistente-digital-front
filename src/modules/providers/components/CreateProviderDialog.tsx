"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { SERVICE_CATEGORIES } from "@/types/api";
import { FormTextField } from "@/components/forms/FormTextField";
import { applyApiErrors } from "@/lib/api/form-errors";
import { CATEGORY_LABELS } from "@/lib/service-categories";
import { providersApi } from "../api";
import { providerSchema, type ProviderFormValues } from "../validation";
import type { CreateProviderDialogProps } from "./create-provider-dialog-props";

/** Alta rápida de un proveedor propio sin salir del formulario del servicio. */
export function CreateProviderDialog({ open, initialName, onClose, onCreated }: CreateProviderDialogProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const { control, handleSubmit, setError, reset, formState } = useForm<ProviderFormValues>({
    resolver: yupResolver(providerSchema),
    defaultValues: { name: initialName, website: "" },
  });

  // Cada vez que se abre arranca con el nombre que el usuario estaba buscando
  useEffect(() => {
    if (open) reset({ name: initialName, website: "" });
  }, [open, initialName, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const created = await providersApi.create({
        name: values.name,
        category: values.category,
        website: values.website || null,
      });
      onCreated(created);
    } catch (e) {
      setFormError(applyApiErrors(e, setError));
    }
  });

  return (
    <Dialog open={open} onClose={() => !formState.isSubmitting && onClose()} aria-labelledby="create-provider-title" fullWidth maxWidth="xs">
      {/* El diálogo vive en un portal, pero React propaga el submit al formulario del servicio: se corta acá */}
      <form
        noValidate
        onSubmit={(e) => {
          e.stopPropagation();
          onSubmit(e);
        }}
      >
        <DialogTitle id="create-provider-title">Agregar un proveedor</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            <DialogContentText>Si tu proveedor no está en el catálogo, lo agregás vos. Solo lo vas a ver vos.</DialogContentText>
            {formError && <Alert severity="error">{formError}</Alert>}
            <FormTextField<ProviderFormValues> name="name" control={control} label="Nombre" required autoFocus />
            <FormTextField<ProviderFormValues> name="category" control={control} label="Categoría" select required>
              {SERVICE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </MenuItem>
              ))}
            </FormTextField>
            <FormTextField<ProviderFormValues>
              name="website"
              control={control}
              label="Sitio web (opcional)"
              placeholder="https://"
              slotProps={{ htmlInput: { inputMode: "url" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={formState.isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" loading={formState.isSubmitting}>
            Agregar proveedor
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
