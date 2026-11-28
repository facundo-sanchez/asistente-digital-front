"use client";

import { useState, useSyncExternalStore } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CopyButton } from "@/components/common/CopyButton";
import { api } from "@/lib/api/client";
import { BASE_PATH } from "@/lib/config";

const subscribeNothing = () => () => {};

/**
 * El link iCal del usuario, cómo agregarlo a Google Calendar y al iPhone, y "Generar otro link"
 * (pide confirmar porque el anterior deja de andar en los calendarios donde ya está).
 */
export function CalendarLink({ initialToken }: { initialToken: string }) {
  const [token, setToken] = useState(initialToken);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // El link lleva el dominio con el que entró el usuario (el que va a poder leer Google)
  const origin = useSyncExternalStore(subscribeNothing, () => window.location.origin, () => "");
  const url = `${origin}${BASE_PATH}/api/calendar/${token}.ics`;

  const regenerate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await api.post<{ token: string }>("calendar/regenerate", {});
      setToken(res.token);
      setConfirming(false);
    } catch {
      setError("No pudimos generar otro link. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    // minmax(0, 1fr): sin esto la columna toma el ancho del link entero y se sale del panel
    <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, border: 1, borderColor: "divider", borderRadius: "10px", pl: 1.5, pr: 0.5, py: 0.5 }}>
        <Typography
          component="code"
          sx={{ flex: 1, minWidth: 0, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          title={url}
        >
          {url}
        </Typography>
        <Box sx={{ flexShrink: 0, whiteSpace: "nowrap" }}>
          <CopyButton text={url} label="Copiar link" />
        </Box>
      </Box>
      <Box component="ol" sx={{ m: 0, pl: 2.5, display: "grid", gap: 1, color: "text.secondary", listStyle: "decimal", "& li::marker": { fontWeight: 600 } }}>
        <li>
          <Typography variant="body2">
            <strong>Google Calendar</strong> (desde la computadora): Otros calendarios → + → Desde URL, pegá el link y tocá Agregar calendario.
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            <strong>iPhone</strong>: Ajustes → Calendario → Cuentas → Agregar cuenta → Otra → Agregar calendario suscrito, y pegá el link.
          </Typography>
        </li>
      </Box>
      <Typography variant="body2" color="text.secondary">
        Ves los vencimientos sin pagar del último mes y de los próximos 12. El calendario se actualiza solo (Google lo hace cada algunas horas). Es
        un link privado: no lo compartas.
      </Typography>
      {confirming ? (
        <Alert
          severity="warning"
          action={
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" size="small" onClick={() => setConfirming(false)} disabled={busy}>
                Cancelar
              </Button>
              <Button color="inherit" size="small" onClick={regenerate} loading={busy}>
                Generar
              </Button>
            </Box>
          }
        >
          El link actual deja de funcionar en los calendarios donde ya lo agregaste.
        </Alert>
      ) : (
        <Box>
          <Button variant="text" color="inherit" onClick={() => setConfirming(true)} sx={{ color: "text.secondary" }}>
            Generar otro link
          </Button>
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </Box>
  );
}
