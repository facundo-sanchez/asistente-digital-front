"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { authApi } from "@/modules/auth/api";

type Status = "idle" | "sending" | "sent" | "error";

/** Aviso de email sin confirmar, con opción de reenviar el enlace. */
export function EmailVerificationBanner({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  const resend = async () => {
    setStatus("sending");
    try {
      await authApi.resendVerification();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return <Alert severity="success">Te enviamos un enlace nuevo a {email}.</Alert>;
  }

  return (
    <Alert
      severity={status === "error" ? "error" : "warning"}
      action={
        <Button color="inherit" size="small" onClick={resend} loading={status === "sending"}>
          Reenviar
        </Button>
      }
    >
      {status === "error"
        ? "No pudimos reenviar el enlace. Probá de nuevo en unos minutos."
        : `Confirmá tu email (${email}) con el enlace que te enviamos.`}
    </Alert>
  );
}
