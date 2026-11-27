"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { EMAIL_CHECK_INTERVALS, type EmailCheckInterval } from "@/types/api";
import { EMAIL_CHECK_LABELS } from "@/lib/email-check-intervals";
import { userApi } from "@/modules/auth/api";

/** Cada cuánto se revisa el correo (módulo 13.6). Menos seguido = menos lecturas con IA. */
export function EmailCheckIntervalForm({ initial }: { initial: EmailCheckInterval }) {
  const [interval, setInterval] = useState<EmailCheckInterval>(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  const save = async () => {
    setSaving(true);
    try {
      await userApi.setEmailCheckInterval(interval);
      setResult("saved");
    } catch {
      setResult("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Revisar mis emails"
        helperText="«Revisar ahora» en Integraciones funciona con cualquier opción."
        value={interval}
        onChange={(e) => {
          setInterval(e.target.value as EmailCheckInterval);
          setResult(null);
        }}
      >
        {EMAIL_CHECK_INTERVALS.map((i) => (
          <MenuItem key={i} value={i}>
            {EMAIL_CHECK_LABELS[i]}
          </MenuItem>
        ))}
      </TextField>
      {result === "saved" && <Alert severity="success">Listo: {EMAIL_CHECK_LABELS[interval].toLowerCase()}.</Alert>}
      {result === "error" && <Alert severity="error">No pudimos guardarlo. Probá de nuevo.</Alert>}
      <Box>
        <Button variant="outlined" onClick={save} loading={saving}>
          Guardar
        </Button>
      </Box>
    </Stack>
  );
}
