"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { ApiError } from "@/lib/api/api-error";
import { currentSubscription, disablePush, enablePush, iosNeedsInstall, pushSupported } from "../push";

type State = "loading" | "unsupported" | "install" | "off" | "on";

/** Notificaciones push en este dispositivo. El permiso se pide al tocar, nunca al entrar. */
export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Lo que puede este navegador y si ya está suscripto (se lee una vez, después de montar)
    const read = async (): Promise<State> => {
      if (!pushSupported()) return iosNeedsInstall() ? "install" : "unsupported";
      const subscription = await currentSubscription().catch(() => null);
      return subscription ? "on" : "off";
    };
    read().then(setState);
  }, []);

  const toggle = async (on: boolean) => {
    setBusy(true);
    setError(null);
    try {
      if (on) {
        const result = await enablePush();
        if (result === "denied") {
          setError("El navegador bloqueó las notificaciones. Habilitalas en la configuración del sitio y volvé a probar.");
          return;
        }
      } else {
        await disablePush();
      }
      setState(on ? "on" : "off");
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 503 ? "Las notificaciones push no están disponibles en este momento." : "No pudimos cambiarlo. Probá de nuevo.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (state === "loading") return null;
  if (state === "install") {
    return (
      <Alert severity="info">En iPhone, primero agregá la app a la pantalla de inicio (Compartir → Agregar a inicio) y activalas desde ahí.</Alert>
    );
  }
  if (state === "unsupported") {
    return <Typography variant="body2" color="text.secondary">Este navegador no permite notificaciones push.</Typography>;
  }
  return (
    <Stack spacing={1}>
      <FormControlLabel
        control={<Switch checked={state === "on"} disabled={busy} onChange={(e) => toggle(e.target.checked)} />}
        label="Notificaciones en este dispositivo"
      />
      <Typography variant="body2" color="text.secondary">
        Te llegan los mismos avisos que ves en la app, aunque la tengas cerrada.
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
