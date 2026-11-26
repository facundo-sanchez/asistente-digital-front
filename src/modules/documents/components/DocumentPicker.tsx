"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { ApiError } from "@/lib/api/api-error";
import { documentsApi } from "../api";
import { ACCEPT_ATTRIBUTE, validateFile } from "../upload-rules";
import type { DocumentPickerProps } from "./document-picker-props";
import type { ServiceOption } from "./service-option";

/**
 * Elegir un documento ya subido o subir uno ahí mismo (queda guardado en Documentos con el
 * tipo y el servicio indicados) y dejarlo elegido.
 */
export function DocumentPicker({ label, value, onChange, documents, uploadType, serviceId }: DocumentPickerProps) {
  const [uploaded, setUploaded] = useState<ServiceOption[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = [...uploaded, ...documents];

  const upload = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const document = await documentsApi.upload(file, uploadType, "", serviceId ?? null, () => undefined);
      setUploaded((current) => [{ id: document.id, name: document.title ?? document.originalFilename }, ...current]);
      onChange(document.id);
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos subir el archivo. Probá de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 1fr) auto" }, alignItems: "start" }}>
      <TextField
        select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        helperText={error ?? "Elegí uno de tus documentos o subí el archivo (PDF, foto o Excel)."}
      >
        <MenuItem value="">Sin archivo</MenuItem>
        {options.map((document) => (
          <MenuItem key={document.id} value={document.id}>
            {document.name}
          </MenuItem>
        ))}
      </TextField>
      <Button component="label" variant="outlined" startIcon={<UploadFileOutlined />} loading={uploading} sx={{ mt: { sm: 1 } }}>
        Subir archivo
        <input type="file" accept={ACCEPT_ATTRIBUTE} hidden onChange={(e) => upload(e.target.files?.[0])} />
      </Button>
    </Box>
  );
}
