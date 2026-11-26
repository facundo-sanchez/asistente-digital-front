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
import { invoicesApi } from "../api";

/** Anular una factura con confirmación: su vencimiento queda cancelado. */
export function InvoiceRejectAction({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = async () => {
    setSaving(true);
    setError(null);
    try {
      await invoicesApi.reject(id);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos anularla. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Anular
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} aria-labelledby="reject-invoice-title" fullWidth maxWidth="xs">
        <DialogTitle id="reject-invoice-title">¿Anular la factura?</DialogTitle>
        <DialogContent>
          <DialogContentText>Su vencimiento queda cancelado. La factura se conserva en el historial como anulada.</DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving} color="inherit">
            Volver
          </Button>
          <Button onClick={reject} loading={saving} variant="contained" color="error">
            Anular factura
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
