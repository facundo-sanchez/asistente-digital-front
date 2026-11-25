import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { SERVICE_LABELS, SERVICE_TINTS } from "@/theme/service-tints";
import type { ServiceKind } from "@/theme/service-kind";

const KINDS = Object.keys(SERVICE_TINTS) as ServiceKind[];

/** Leyenda del código de color: la franja de tinte de cada tipo de servicio con su nombre. */
export function ServiceTintLegend() {
  return (
    <Box>
      <Typography
        component="p"
        sx={{ fontFamily: "var(--font-archivo-narrow)", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", color: "text.secondary", mb: 1.25 }}
      >
        Color por servicio
      </Typography>
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexWrap: "wrap", columnGap: 2.5, rowGap: 1.25 }}>
        {KINDS.map((kind) => (
          <Box component="li" key={kind} sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
            <Box component="span" sx={{ width: 6, height: 20, borderRadius: 0.5, bgcolor: SERVICE_TINTS[kind] }} />
            <Typography component="span" variant="body2">
              {SERVICE_LABELS[kind]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
