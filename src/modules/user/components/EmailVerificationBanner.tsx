"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
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
      // En pantallas chicas la acción baja debajo del mensaje: el texto usa todo el ancho
      sx={{
        flexWrap: { xs: "wrap", sm: "nowrap" },
        // 48px: el ancho del icono; así el mensaje ocupa la fila y solo la acción pasa abajo
        "& .MuiAlert-message": { flex: { xs: "1 1 calc(100% - 48px)", sm: "1 1 0" } },
        "& .MuiAlert-action": { ml: { xs: 4.5, sm: "auto" }, pl: { xs: 0, sm: 2 }, pt: 0 },
      }}
      action={
        <Button color="inherit" size="small" onClick={resend} loading={status === "sending"}>
          Reenviar
        </Button>
      }
    >
      {status === "error" ? (
        "No pudimos reenviar el enlace. Probá de nuevo en unos minutos."
      ) : (
        <>
          Confirmá tu email con el enlace que te enviamos a{" "}
          {/* El email solo se corta si no entra en la línea (direcciones muy largas en mobile) */}
          <Box component="strong" sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>
            {email}
          </Box>
          .
        </>
      )}
    </Alert>
  );
}
