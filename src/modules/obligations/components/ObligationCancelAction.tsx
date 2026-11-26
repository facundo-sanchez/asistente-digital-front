"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ApiError } from "@/lib/api/api-error";
import { obligationsApi } from "../api";

/** Cancelar una obligación, con confirmación y motivo opcional. Al terminar refresca el detalle. */
export function ObligationCancelAction({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async () => {
    setSaving(true);
    setError(null);
    try {
      await obligationsApi.cancel(id, { reason: reason.trim() || null });
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos cancelarla. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={() => setOpen(true)}>
        Cancelar vencimiento
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} aria-labelledby="cancel-obligation-title" fullWidth maxWidth="xs">
        <DialogTitle id="cancel-obligation-title">¿Cancelar «{title}»?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Ya no hay que pagarla. Queda en el historial como cancelada.</DialogContentText>
          <TextField
            label="Motivo (opcional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving} color="inherit">
            Volver
          </Button>
          <Button onClick={cancel} loading={saving} variant="contained">
            Cancelar vencimiento
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
