"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import type { NotificationChannel, NotificationPreferenceResponse, NotificationType } from "@/types/api";
import { notificationsApi } from "../api";

const CHANNELS: { channel: NotificationChannel; label: string }[] = [
  { channel: "WEB", label: "En la app" },
  { channel: "EMAIL", label: "Por email" },
];

const TYPES: { type: NotificationType; label: string }[] = [
  { type: "OBLIGATION_DUE_SOON", label: "Vencimientos que se acercan" },
  { type: "OBLIGATION_OVERDUE", label: "Vencimientos que se pasaron sin pagar" },
  { type: "DOCUMENT_EXPIRING", label: "Documentos por vencer (pólizas, garantías…)" },
  { type: "DOCUMENT_DETECTED", label: "Archivos que la IA terminó de leer" },
];

const DAYS = [0, 1, 3, 7, 15];

function dayLabel(days: number): string {
  if (days === 0) return "El día";
  if (days === 1) return "1 día antes";
  return `${days} días antes`;
}

/** Qué avisos recibir, por qué canal y con cuánta anticipación (CU-007). Se guarda todo junto. */
export function NotificationPreferencesForm({ initial }: { initial: NotificationPreferenceResponse[] }) {
  const [preferences, setPreferences] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  const find = (channel: NotificationChannel, type: NotificationType) =>
    preferences.find((p) => p.channel === channel && p.notificationType === type);

  const update = (channel: NotificationChannel, type: NotificationType, change: Partial<NotificationPreferenceResponse>) => {
    setResult(null);
    setPreferences((current) => current.map((p) => (p.channel === channel && p.notificationType === type ? { ...p, ...change } : p)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await notificationsApi.savePreferences(
        preferences.map(({ channel, notificationType, enabled, daysBefore }) => ({ channel, notificationType, enabled, daysBefore })),
      );
      setPreferences(saved);
      setResult("saved");
    } catch {
      setResult("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
        {CHANNELS.map(({ channel, label }) => {
          const all = find(channel, "ALL");
          if (!all) return null;
          return (
            <Box key={channel} sx={{ minWidth: 0 }}>
              <FormControlLabel
                control={<Switch checked={all.enabled} onChange={(e) => update(channel, "ALL", { enabled: e.target.checked })} />}
                label={<Typography sx={{ fontWeight: 600 }}>{label}</Typography>}
              />
              <FormGroup aria-label={`Avisos ${label.toLowerCase()}`} sx={{ mt: 1, opacity: all.enabled ? 1 : 0.5 }}>
                {TYPES.map(({ type, label: typeLabel }) => (
                  <FormControlLabel
                    key={type}
                    disabled={!all.enabled}
                    control={
                      <Checkbox
                        size="small"
                        checked={find(channel, type)?.enabled ?? false}
                        onChange={(e) => update(channel, type, { enabled: e.target.checked })}
                      />
                    }
                    label={<Typography variant="body2">{typeLabel}</Typography>}
                  />
                ))}
              </FormGroup>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }} id={`days-${channel}`}>
                Avisar los vencimientos
              </Typography>
              <ToggleButtonGroup
                size="small"
                value={all.daysBefore}
                onChange={(_, days: number[]) => update(channel, "ALL", { daysBefore: [...days].sort((a, b) => a - b) })}
                disabled={!all.enabled}
                aria-labelledby={`days-${channel}`}
                sx={{ flexWrap: "wrap" }}
              >
                {DAYS.map((days) => (
                  <ToggleButton key={days} value={days} sx={{ textTransform: "none" }}>
                    {dayLabel(days)}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          );
        })}
      </Box>
      {result === "saved" && <Alert severity="success">Guardamos tus preferencias.</Alert>}
      {result === "error" && <Alert severity="error">No pudimos guardar. Probá de nuevo.</Alert>}
      <Box>
        <Button variant="contained" onClick={save} loading={saving}>
          Guardar preferencias
        </Button>
      </Box>
    </Stack>
  );
}
