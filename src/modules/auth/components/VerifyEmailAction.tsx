"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { TextLink } from "@/components/common/TextLink";
import { ApiError } from "@/lib/api/api-error";
import { HOME_PATH } from "@/lib/config";
import { authApi } from "../api";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Confirma el email al hacer clic (POST), no al abrir la página: los antivirus y
 * previsualizadores de correo abren los enlaces y consumirían el token de un solo uso.
 */
export function VerifyEmailAction({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const confirm = async () => {
    setStatus("loading");
    try {
      await authApi.verifyEmail({ token });
      setStatus("done");
    } catch (e) {
      setMessage(e instanceof ApiError && e.data ? e.data.mensaje : "No se pudo confirmar el email.");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <Stack spacing={2}>
        <Alert severity="success">¡Listo! Tu email quedó confirmado.</Alert>
        <TextLink href={HOME_PATH}>Ir al inicio</TextLink>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {status === "error" && (
        <Alert severity="error">
          {message} Podés pedir un enlace nuevo desde tu perfil.
        </Alert>
      )}
      <Button variant="contained" size="large" onClick={confirm} loading={status === "loading"}>
        Confirmar mi email
      </Button>
    </Stack>
  );
}
