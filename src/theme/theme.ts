"use client";

import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/material/locale";

/** Tema base de la app. Colores y tipografía centralizados acá. */
export const theme = createTheme(
  {
    cssVariables: true,
    palette: {
      mode: "light",
      primary: { main: "#1f4e79" },
      secondary: { main: "#00897b" },
      background: { default: "#f5f7fa" },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: "var(--font-nunito), Helvetica, Arial, sans-serif",
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiTextField: { defaultProps: { fullWidth: true, size: "medium" } },
      MuiButton: { defaultProps: { disableElevation: true } },
    },
  },
  esES,
);
