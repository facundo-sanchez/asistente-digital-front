/**
 * Colores propios de la paleta MUI: el riel de navegación (tinta petróleo) y los
 * tintes de servicio. Con cssVariables quedan como --mui-palette-rail-*.
 */
import "@mui/material/styles";
import type { ServiceKind } from "./service-kind";

declare module "@mui/material/styles" {
  interface Palette {
    rail: { background: string; text: string; textActive: string; hover: string; selected: string };
    serviceTint: Record<ServiceKind, string>;
  }
  interface PaletteOptions {
    rail?: { background: string; text: string; textActive: string; hover: string; selected: string };
    serviceTint?: Record<ServiceKind, string>;
  }
}
