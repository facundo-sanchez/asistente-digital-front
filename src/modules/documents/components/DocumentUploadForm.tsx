"use client";

import { useState, type DragEvent, type FormEvent } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { DOCUMENT_TYPES, type DocumentType } from "@/types/api";
import { useStoredFlag } from "@/hooks/use-stored-flag";
import { ApiError } from "@/lib/api/api-error";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";
import { documentsApi } from "../api";
import type { DocumentUploadFormProps } from "./document-upload-form-props";
import { ACCEPTED_LABEL, ACCEPT_ATTRIBUTE, formatFileSize, validateFile } from "../upload-rules";

/** Subir un documento: elegir o arrastrar el archivo, tipo y título opcional. */
export function DocumentUploadForm({ service, aiTypes }: DocumentUploadFormProps) {
  const router = useRouter();
  const backHref = service ? `/services/${service.id}` : "/documents";
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("INVOICE");
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Se recuerda en este navegador; por defecto, sí
  const [readWithAi, setReadWithAi] = useStoredFlag("adv:read-with-ai", true);
  const aiOffered = aiTypes.includes(documentType);

  const pick = (picked: File | undefined) => {
    if (!picked) return;
    const problem = validateFile(picked);
    setError(problem);
    setFile(problem ? null : picked);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    pick(event.dataTransfer.files[0]);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Elegí un archivo.");
      return;
    }
    setError(null);
    setProgress(0);
    try {
      const process = aiOffered && readWithAi;
      const uploaded = await documentsApi.upload(file, documentType, title, service?.id ?? null, setProgress, process);
      // Con lectura con IA, al detalle: ahí se ve cómo avanza
      router.push(process ? `/documents/${uploaded.id}` : `${backHref}?uploaded=1`);
      router.refresh();
    } catch (e) {
      setProgress(null);
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos subir el archivo. Probá de nuevo.");
    }
  };

  const uploading = progress !== null;

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {service && <Alert severity="info">Queda asociado al servicio «{service.name}».</Alert>}

        <Box
          component="label"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          sx={{
            display: "grid",
            justifyItems: "center",
            gap: 1,
            p: 4,
            textAlign: "center",
            border: 2,
            borderStyle: "dashed",
            borderRadius: 3,
            borderColor: dragging ? "secondary.main" : "divider",
            bgcolor: dragging ? "action.hover" : "background.default",
            cursor: uploading ? "default" : "pointer",
          }}
        >
          <input
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            hidden
            disabled={uploading}
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <UploadFileOutlined color="primary" sx={{ fontSize: 36 }} />
          {file ? (
            <>
              <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{file.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {formatFileSize(file.size)} · Tocá para cambiarlo
              </Typography>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 600 }}>Arrastrá el archivo acá o tocá para elegirlo</Typography>
              <Typography variant="body2" color="text.secondary">
                {ACCEPTED_LABEL} de hasta 10 MB
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <TextField
            select
            label="Tipo de documento"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value as DocumentType)}
            disabled={uploading}
          >
            {DOCUMENT_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {DOCUMENT_TYPE_LABELS[type]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Título (opcional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 200 } }}
            helperText="Ej. «Factura luz octubre». Si lo dejás vacío se usa el nombre del archivo."
            disabled={uploading}
          />
        </Box>

        {aiOffered && (
          <Box>
            <FormControlLabel
              control={<Checkbox checked={readWithAi} onChange={(e) => setReadWithAi(e.target.checked)} disabled={uploading} />}
              label="Leer el archivo con IA y cargar los datos"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4, maxWidth: "60ch" }}>
              Se envía a Google Gemini solo para leerlo. Antes de guardar nada vas a poder revisar los datos.
            </Typography>
          </Box>
        )}

        {uploading && (
          <Box>
            <LinearProgress variant="determinate" value={progress} aria-label="Progreso de la subida" />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Subiendo… {progress}%
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button type="submit" variant="contained" size="large" loading={uploading} disabled={!file}>
            Subir documento
          </Button>
          <Button component={NextLink} href={backHref} size="large" color="inherit" disabled={uploading}>
            Cancelar
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
