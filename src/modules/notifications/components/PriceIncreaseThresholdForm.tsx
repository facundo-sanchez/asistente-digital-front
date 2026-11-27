"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { PRICE_INCREASE_THRESHOLDS, type PriceIncreaseThreshold } from "@/types/api";
import { userApi } from "@/modules/auth/api";

/** Desde qué % de aumento de una factura avisar (módulo 16). */
export function PriceIncreaseThresholdForm({ initial }: { initial: PriceIncreaseThreshold }) {
  const [threshold, setThreshold] = useState<PriceIncreaseThreshold>(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<"saved" | "error" | null>(null);

  const save = async () => {
    setSaving(true);
    try {
      await userApi.setPriceIncreaseThreshold(threshold);
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
        label="Avisarme si una factura sube más de"
        helperText="Respecto del promedio de las últimas 3 facturas del mismo servicio."
        value={threshold}
        onChange={(e) => {
          setThreshold(Number(e.target.value) as PriceIncreaseThreshold);
          setResult(null);
        }}
      >
        {PRICE_INCREASE_THRESHOLDS.map((t) => (
          <MenuItem key={t} value={t}>
            {t} %
          </MenuItem>
        ))}
      </TextField>
      {result === "saved" && <Alert severity="success">Listo, te avisamos desde un {threshold} % de aumento.</Alert>}
      {result === "error" && <Alert severity="error">No pudimos guardarlo. Probá de nuevo.</Alert>}
      <Box>
        <Button variant="outlined" onClick={save} loading={saving}>
          Guardar
        </Button>
      </Box>
    </Stack>
  );
}
