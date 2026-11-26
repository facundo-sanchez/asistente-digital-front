"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ApiError } from "@/lib/api/api-error";
import { recurringRulesApi } from "../api";

/** Dejar de repetir (no genera más vencimientos) o reanudar una repetición. */
export function RecurrenceStatusAction({ ruleId, active }: { ruleId: string; active: boolean }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = async () => {
    setSaving(true);
    setError(null);
    try {
      await recurringRulesApi.changeStatus(ruleId, !active);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos cambiarla. Probá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={1}>
      <Button variant="outlined" color="inherit" onClick={change} loading={saving}>
        {active ? "Dejar de repetir" : "Reanudar"}
      </Button>
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
}
