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
import { loansApi } from "../api";

/** Cancelar el préstamo (anticipadamente o para refinanciar), con confirmación y motivo. */
export function CancelLoanAction({ loanId }: { loanId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Cancelación anticipada");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancel = async () => {
    setSaving(true);
    try {
      await loansApi.cancel(loanId, reason);
      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "No pudimos cancelarlo. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Button color="inherit" onClick={() => setOpen(true)}>
        Cancelar el préstamo
      </Button>
      <Dialog open={open} onClose={() => !saving && setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>¿Cancelar el préstamo?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Las cuotas pendientes se cancelan y dejan de avisarte. Las que ya pagaste quedan registradas.
          </DialogContentText>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="Motivo" value={reason} onChange={(e) => setReason(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={() => setOpen(false)} disabled={saving}>Volver</Button>
          <Button color="error" variant="contained" onClick={cancel} loading={saving}>Cancelar el préstamo</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
