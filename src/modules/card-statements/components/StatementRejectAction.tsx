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
import { ApiError } from "@/lib/api/api-error";
import { cardStatementsApi } from "../api";

/** Anular un resumen con confirmación: sus vencimientos quedan cancelados. */
export function StatementRejectAction({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = async () => {
    setSaving(true);
    setError(null);
    try {
      await cardStatementsApi.reject(id);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos anularlo. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Anular
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} aria-labelledby="reject-statement-title" fullWidth maxWidth="xs">
        <DialogTitle id="reject-statement-title">¿Anular el resumen?</DialogTitle>
        <DialogContent>
          <DialogContentText>Sus vencimientos en pesos y en dólares quedan cancelados. El resumen se conserva como anulado.</DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving} color="inherit">
            Volver
          </Button>
          <Button onClick={reject} loading={saving} variant="contained" color="error">
            Anular resumen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
