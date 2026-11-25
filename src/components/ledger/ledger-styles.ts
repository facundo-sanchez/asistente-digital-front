/**
 * Estilos de las tablas tipo libro de cuentas (DESIGN.md): encabezados en Archivo
 * Narrow, filas con filete y franja de tinte a la izquierda.
 */

export const ledgerTable = { width: "100%", borderCollapse: "collapse" } as const;

export const ledgerHeadCell = {
  fontFamily: "var(--font-archivo-narrow)",
  fontWeight: 600,
  fontSize: "0.78rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "text.secondary",
  textAlign: "left",
  py: 1,
  px: 1.5,
  borderBottom: 1,
  borderColor: "divider",
} as const;

export const ledgerCell = { py: 1.75, px: 1.5, borderBottom: 1, borderColor: "divider", verticalAlign: "middle" } as const;

/** Celda de la franja de tinte (sin padding horizontal). */
export const ledgerStripCell = { ...ledgerCell, px: 0, width: 6 } as const;

/** En mobile solo entran la franja, el nombre y el estado: el resto se oculta. */
export const desktopOnly = { display: { xs: "none", sm: "table-cell" } } as const;

/** Texto solo para lectores de pantalla. */
export const visuallyHidden = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
} as const;
