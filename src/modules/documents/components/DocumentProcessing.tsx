"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { ApiError } from "@/lib/api/api-error";
import { formatDay } from "@/lib/dates";
import { processingErrorMessage } from "@/lib/processing-labels";
import { documentsApi } from "../api";
import type { DocumentProcessingProps } from "./document-processing-props";
import { ProcessingStatusLabel } from "./ProcessingStatusLabel";

/** Cada cuánto se vuelve a consultar mientras la IA lo está leyendo. */
const POLL_MS = 4000;

/**
 * Estado de la lectura con IA de un documento: mientras espera o se lee, la página se refresca
 * sola; si falló, se puede reintentar; si nunca se pidió, se puede pedir.
 */
export function DocumentProcessing({ document, job, canProcess, extractionId }: DocumentProcessingProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = document.processingStatus;
  const working = status === "PENDING" || status === "PROCESSING";

  useEffect(() => {
    if (!working) return;
    const timer = setInterval(() => router.refresh(), POLL_MS);
    return () => clearInterval(timer);
  }, [working, router]);

  const process = async () => {
    setSending(true);
    setError(null);
    try {
      await documentsApi.process(document.id);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos pedir la lectura. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  if (status === "NOT_REQUIRED") {
    if (!canProcess) return null;
    return (
      <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          La IA puede leer este archivo y cargar los datos por vos. Se envía a Google Gemini solo para leerlo.
        </Typography>
        <Button variant="outlined" startIcon={<AutoAwesomeOutlined />} onClick={process} loading={sending}>
          Leer con IA
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
      <ProcessingStatusLabel status={status} />
      {working && job?.nextRetryAt && (
        <Typography variant="body2" color="text.secondary">
          Falló el intento anterior ({processingErrorMessage(job.errorCode)}); lo volvemos a intentar solos.
        </Typography>
      )}
      {status === "FAILED" && (
        <>
          <Typography variant="body2" color="text.secondary">
            {processingErrorMessage(job?.errorCode ?? null)} Podés reintentar o cargar los datos a mano.
          </Typography>
          {canProcess && (
            <Button variant="outlined" startIcon={<AutoAwesomeOutlined />} onClick={process} loading={sending}>
              Reintentar
            </Button>
          )}
        </>
      )}
      {status === "REQUIRES_REVIEW" && extractionId && (
        <>
          <Typography variant="body2" color="text.secondary">
            {job?.completedAt ? `Leído el ${formatDay(job.completedAt)}. ` : ""}Revisá los datos: nada se guarda hasta que confirmes.
          </Typography>
          <ButtonLink href={`/extractions/${extractionId}`} variant="contained">
            Revisar y confirmar
          </ButtonLink>
        </>
      )}
      {status === "COMPLETED" && extractionId && (
        <TextLink href={`/extractions/${extractionId}`}>Ver lo que leyó la IA</TextLink>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
