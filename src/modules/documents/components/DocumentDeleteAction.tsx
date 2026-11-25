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
import { documentsApi } from "../api";

/** Eliminar un documento, con confirmación. Al terminar vuelve al listado. */
export function DocumentDeleteAction({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setDeleting(true);
    setError(null);
    try {
      await documentsApi.remove(id);
      router.push("/documents?deleted=1");
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos eliminarlo. Probá de nuevo.");
      setDeleting(false);
    }
  };

  return (
    <>
      <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
        Eliminar
      </Button>
      <Dialog open={open} onClose={() => !deleting && setOpen(false)} aria-labelledby="delete-document-title">
        <DialogTitle id="delete-document-title">¿Eliminar «{name}»?</DialogTitle>
        <DialogContent>
          <DialogContentText>Deja de aparecer en tus documentos y en el servicio asociado.</DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={deleting} color="inherit">
            Cancelar
          </Button>
          <Button onClick={remove} loading={deleting} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
