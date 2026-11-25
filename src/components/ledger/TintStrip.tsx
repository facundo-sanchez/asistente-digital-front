import Box from "@mui/material/Box";

/** Franja vertical con el tinte del servicio (el color siempre va acompañado de su nombre en la fila). */
export function TintStrip({ color, height = 36 }: { color: string; height?: number }) {
  return <Box aria-hidden sx={{ width: 6, height, borderRadius: 0.5, bgcolor: color }} />;
}
