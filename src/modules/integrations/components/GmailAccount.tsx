"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import type { IntegrationResponse } from "@/types/api";
import { formatDay } from "@/lib/dates";
import { integrationsApi } from "../api";
import { ConnectGmail } from "./ConnectGmail";

/** Una cuenta de Gmail conectada: cuándo se sincronizó, sincronizar ahora y desconectar. */
export function GmailAccount({ integration }: { integration: IntegrationResponse }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState<{ severity: "success" | "error"; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const needsReconnect = integration.status !== "ACTIVE";

  const sync = async () => {
    setSyncing(true);
    setMessage(null);
    try {
      const result = await integrationsApi.sync(integration.id);
      setMessage({
        severity: "success",
        text:
          result.imported === 0
            ? "No hay correos nuevos de tus proveedores."
            : `Importamos ${result.imported} ${result.imported === 1 ? "documento" : "documentos"}: te esperan en «Para revisar».`,
      });
      router.refresh();
    } catch {
      setMessage({ severity: "error", text: "No pudimos sincronizar. Probá de nuevo en unos minutos." });
    } finally {
      setSyncing(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      await integrationsApi.disconnect(integration.id);
      setConfirming(false);
      router.refresh();
    } catch {
      setMessage({ severity: "error", text: "No pudimos desconectar. Probá de nuevo." });
      setDisconnecting(false);
    }
  };

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box>
        <Typography sx={{ fontWeight: 600 }}>{integration.externalAccountId}</Typography>
        <Typography variant="body2" color="text.secondary">
          {integration.lastSyncAt
            ? `Última revisión: ${formatDay(integration.lastSyncAt)}`
            : "Todavía no se revisó: la primera vuelta es en unos minutos."}
          {" · Revisamos tu correo cada 15 minutos."}
        </Typography>
      </Box>
      {needsReconnect ? (
        <>
          <Alert severity="warning">Google ya no nos deja leer tu correo (se revocó o venció el permiso). Volvé a conectarlo.</Alert>
          <ConnectGmail reconnect />
        </>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <Button variant="outlined" onClick={sync} loading={syncing}>
            Revisar ahora
          </Button>
          <Button color="inherit" onClick={() => setConfirming(true)}>
            Desconectar
          </Button>
        </Box>
      )}
      {message && <Alert severity={message.severity}>{message.text}</Alert>}
      {needsReconnect && (
        <Box>
          <Button color="inherit" onClick={() => setConfirming(true)}>
            Desconectar
          </Button>
        </Box>
      )}

      <Dialog open={confirming} onClose={() => !disconnecting && setConfirming(false)} aria-labelledby="disconnect-title">
        <DialogTitle id="disconnect-title">¿Desconectar {integration.externalAccountId}?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Dejamos de revisar tu correo y le quitamos el permiso en Google. Las facturas y documentos que ya importamos quedan en la app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirming(false)} disabled={disconnecting} color="inherit">
            Cancelar
          </Button>
          <Button onClick={disconnect} loading={disconnecting} color="error" variant="contained">
            Desconectar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
