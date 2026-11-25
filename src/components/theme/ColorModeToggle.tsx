"use client";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";

/**
 * Cambia entre modo claro y oscuro. Hasta que el usuario elige, se usa el del sistema.
 * Antes de hidratar el modo es desconocido: se reserva el lugar sin icono para no
 * mostrar uno equivocado.
 */
export function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const current = mode === "system" ? systemMode : mode;

  if (!current) {
    return <IconButton disabled aria-hidden sx={{ width: 40, height: 40 }} />;
  }

  const next = current === "dark" ? "light" : "dark";
  const label = next === "dark" ? "Usar modo oscuro" : "Usar modo claro";
  return (
    <Tooltip title={label}>
      <IconButton onClick={() => setMode(next)} aria-label={label} sx={{ color: "text.secondary" }}>
        {current === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  );
}
