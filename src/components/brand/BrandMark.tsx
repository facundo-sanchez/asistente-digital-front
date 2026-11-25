import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { BrandMarkProps } from "./brand-mark-props";
import { GuillocheRosette } from "./GuillocheRosette";

/** Marca de la app: roseta guilloché chica y el nombre. */
export function BrandMark({ tone = "page" }: BrandMarkProps) {
  const onRail = tone === "rail";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <GuillocheRosette
        value={null}
        size={34}
        lineColor={onRail ? "var(--mui-palette-rail-textActive)" : "var(--mui-palette-primary-main)"}
      />
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: "0.98rem",
          lineHeight: 1.15,
          color: onRail ? "rail.textActive" : "text.primary",
        }}
      >
        Asistente de
        <br />
        Vida Digital
      </Typography>
    </Box>
  );
}
