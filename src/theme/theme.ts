"use client";

import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/material/locale";
import { SERVICE_TINTS } from "./service-tints";

/**
 * Tema "Papel moneda": papel de seguridad teñido, tinta intaglio petróleo y un tinte
 * de denominación como acento. Claro y oscuro comparten estructura; el modo lo elige
 * el usuario (por defecto, el del sistema). Ver DESIGN.md.
 */

/** Acento único para todo estado vivo (foco, selección): naranja hornero. */
const ACCENT = { light: "#A85A17", dark: "#E9A35E" };

const RAIL = {
  light: { background: "#16323A", text: "#BFD2C9", textActive: "#FFFFFF", hover: "rgba(255,255,255,0.06)", selected: "rgba(255,255,255,0.10)" },
  dark: { background: "#0A1B1F", text: "#A9C2B8", textActive: "#FFFFFF", hover: "rgba(255,255,255,0.05)", selected: "rgba(255,255,255,0.08)" },
};

export const theme = createTheme(
  {
    cssVariables: { colorSchemeSelector: "class" },
    colorSchemes: {
      light: {
        palette: {
          primary: { main: "#1D4650", dark: "#16323A", light: "#2C5C67", contrastText: "#FFFFFF" },
          secondary: { main: ACCENT.light, contrastText: "#FFFFFF" },
          error: { main: "#B3261E" },
          // Ocre, distinto del acento hornero: un aviso no se confunde con un estado activo
          warning: { main: "#8A6A0A" },
          success: { main: "#3F6E3A" },
          info: { main: "#2F5E8C" },
          background: { default: "#E9EFEB", paper: "#F6F9F7" },
          text: { primary: "#16323A", secondary: "#48656B" },
          divider: "#C9D8D0",
          rail: RAIL.light,
          serviceTint: SERVICE_TINTS,
        },
      },
      dark: {
        palette: {
          primary: { main: "#8CC5B6", dark: "#6FAE9E", light: "#AAD7CB", contrastText: "#0F2328" },
          secondary: { main: ACCENT.dark, contrastText: "#1A1206" },
          error: { main: "#F2A39C" },
          warning: { main: "#E2C066" },
          success: { main: "#8DBF84" },
          info: { main: "#8DB4DB" },
          background: { default: "#0F2328", paper: "#14303A" },
          text: { primary: "#E3ECE7", secondary: "#9DB8AE" },
          divider: "#2A4A52",
          rail: RAIL.dark,
          serviceTint: SERVICE_TINTS,
        },
      },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: "var(--font-archivo), system-ui, sans-serif",
      h1: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2 },
      h2: { fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.25 },
      h3: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.3 },
      h4: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.2 },
      h5: { fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontSize: "1.0625rem", fontWeight: 600 },
      subtitle2: { fontFamily: "var(--font-archivo-narrow), system-ui, sans-serif", fontWeight: 600, letterSpacing: "0.04em" },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    },
    components: {
      MuiTextField: { defaultProps: { fullWidth: true, size: "medium" } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10, paddingInline: 18 } },
      },
      MuiPaper: {
        styleOverrides: {
          outlined: ({ theme }) => ({ borderRadius: 14, borderColor: theme.vars.palette.divider }),
        },
      },
      // Foco de los campos con el acento único (el mismo del anillo de foco y del menú activo)
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.vars.palette.background.paper,
            [`&.Mui-focused .MuiOutlinedInput-notchedOutline`]: { borderColor: theme.vars.palette.secondary.main },
          }),
          input: ({ theme }) => ({
            // El borde del campo ya marca el foco: sin el anillo global sobre el <input> interno
            "&:focus-visible": { outline: "none" },
            // Autocompletado del navegador: papel y tinta del tema en lugar de su fondo azul
            "&:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 100px ${theme.vars.palette.background.paper} inset`,
              WebkitTextFillColor: theme.vars.palette.text.primary,
              caretColor: theme.vars.palette.secondary.main,
              borderRadius: "inherit",
            },
          }),
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: ({ theme }) => ({ "&.Mui-focused": { color: theme.vars.palette.secondary.main } }),
        },
      },
      MuiAlert: { styleOverrides: { root: { borderRadius: 10 }, message: { minWidth: 0 } } },
      MuiTooltip: { defaultProps: { arrow: true } },
    },
  },
  esES,
);
