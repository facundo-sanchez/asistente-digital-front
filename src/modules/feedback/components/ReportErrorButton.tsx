"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { feedbackApi } from "../api";

/**
 * "Reportar": guarda el error en la base con la pantalla y los datos técnicos (mensaje, digest
 * de Next, navegador, hora). El usuario lo sabe porque lo toca él: no se manda solo.
 */
export function ReportErrorButton({ error }: { error: Error & { digest?: string } }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const report = async () => {
    setState("sending");
    try {
      await feedbackApi.send({
        kind: "ERROR_REPORT",
        page: window.location.pathname + window.location.search,
        details: JSON.stringify({
          message: error.message,
          name: error.name,
          digest: error.digest,
          at: new Date().toISOString(),
          userAgent: navigator.userAgent,
          online: navigator.onLine,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer || null,
        }),
      });
      setState("sent");
    } catch {
      setState("failed");
    }
  };

  if (state === "sent") {
    return (
      <Typography role="status" color="text.secondary" sx={{ alignSelf: "center" }}>
        Gracias, recibimos el reporte.
      </Typography>
    );
  }
  return (
    <>
      <Button variant="text" color="inherit" onClick={report} loading={state === "sending"}>
        Reportar
      </Button>
      {state === "failed" && (
        <Typography role="alert" variant="body2" color="text.secondary" sx={{ flexBasis: "100%" }}>
          No pudimos mandar el reporte porque el servicio no responde. Probá de nuevo cuando vuelva.
        </Typography>
      )}
    </>
  );
}
