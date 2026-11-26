"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ApiError } from "@/lib/api/api-error";
import { cardsApi } from "../api";

/** Dar de baja (sus resúmenes y vencimientos se conservan) o reactivar una tarjeta. */
export function CardStatusAction({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async () => {
    setSaving(true);
    setError(null);
    try {
      await cardsApi.changeStatus(id, !active);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos cambiar el estado. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={1}>
      <Button variant="outlined" color="inherit" onClick={change} loading={saving}>
        {active ? "Dar de baja" : "Reactivar"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
