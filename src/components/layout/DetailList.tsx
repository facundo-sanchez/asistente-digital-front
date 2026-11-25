import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ledgerHeadCell } from "@/components/ledger/ledger-styles";
import type { DetailListProps } from "./detail-list-props";

/** Rótulo con el mismo estilo que los encabezados de las tablas (Archivo Narrow). */
const labelSx = {
  fontFamily: ledgerHeadCell.fontFamily,
  fontWeight: ledgerHeadCell.fontWeight,
  fontSize: ledgerHeadCell.fontSize,
  letterSpacing: ledgerHeadCell.letterSpacing,
  textTransform: ledgerHeadCell.textTransform,
  color: ledgerHeadCell.color,
  pt: { xs: 1.5, sm: 1.75 },
} as const;

/** Datos de un registro como lista de definiciones (rótulo y valor). */
export function DetailList({ rows }: DetailListProps) {
  return (
    <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, columnGap: 3 }}>
      {rows.map(([label, value]) => (
        <Box key={label} sx={{ display: "contents" }}>
          <Typography component="dt" sx={labelSx}>
            {label}
          </Typography>
          <Box component="dd" sx={{ m: 0, py: { xs: 0.5, sm: 1.5 }, borderBottom: { sm: 1 }, borderColor: { sm: "divider" } }}>
            {value}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
