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
import Stack from "@mui/material/Stack";
import type { ServiceResponse } from "@/types/api";
import { ApiError } from "@/lib/api/api-error";
import { servicesApi } from "../api";

/**
 * Desactivar (con confirmación, aclarando que el historial se conserva) o reactivar
 * un servicio. Al terminar refresca la página para mostrar el estado nuevo.
 */
export function ServiceStatusAction({ service }: { service: Pick<ServiceResponse, "id" | "name" | "active"> }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async (active: boolean) => {
    setSaving(true);
    setError(null);
    try {
      await servicesApi.changeStatus(service.id, { active });
      setConfirmOpen(false);
      router.refresh();
    } catch (e) {
      // Mostrar el motivo del backend si lo hay (ej. sesión vencida, servicio inexistente)
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos cambiar el estado. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (!service.active) {
    return (
      <Stack spacing={1}>
        <Button variant="outlined" onClick={() => change(true)} loading={saving}>
          Reactivar
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    );
  }

  return (
    <>
      <Button variant="outlined" color="inherit" onClick={() => setConfirmOpen(true)}>
        Desactivar
      </Button>
      <Dialog open={confirmOpen} onClose={() => !saving && setConfirmOpen(false)} aria-labelledby="deactivate-title">
        <DialogTitle id="deactivate-title">¿Desactivar «{service.name}»?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deja de aparecer en tus servicios activos y no se generan vencimientos nuevos. Sus facturas y pagos se
            conservan, y podés reactivarlo cuando quieras.
          </DialogContentText>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={saving} color="inherit">
            Cancelar
          </Button>
          <Button onClick={() => change(false)} loading={saving} variant="contained">
            Desactivar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
