import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TextLink } from "@/components/common/TextLink";
import { ledgerHeadCell } from "@/components/ledger/ledger-styles";
import type { KpiTileProps } from "./kpi-tile-props";

/** Un indicador del Inicio: rótulo, número y acceso a su listado. El color de alerta nunca va solo. */
export function KpiTile({ label, value, detail, href, alert = false }: KpiTileProps) {
  return (
    <TextLink
      href={href}
      underline="none"
      sx={{
        display: "grid",
        gap: 0.75,
        p: 2.5,
        border: 1,
        borderColor: alert ? "error.main" : "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        color: "text.primary",
        transition: "border-color 120ms ease",
        "&:hover": { borderColor: alert ? "error.main" : "text.secondary" },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: ledgerHeadCell.fontFamily,
          fontWeight: ledgerHeadCell.fontWeight,
          fontSize: ledgerHeadCell.fontSize,
          letterSpacing: ledgerHeadCell.letterSpacing,
          textTransform: ledgerHeadCell.textTransform,
          color: alert ? "error.main" : "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Box component="span" className="tabular-nums" sx={{ fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.2 }}>
        {value}
      </Box>
      {detail && (
        <Typography component="span" variant="body2" color="text.secondary">
          {detail}
        </Typography>
      )}
    </TextLink>
  );
}
