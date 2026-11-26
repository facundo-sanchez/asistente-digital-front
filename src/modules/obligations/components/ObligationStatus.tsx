import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { EffectiveObligationStatus } from "@/types/api";
import { OBLIGATION_STATUS_COLORS, OBLIGATION_STATUS_LABELS } from "@/lib/obligation-labels";

/** Estado de la obligación con palabra y punto (el color nunca va solo). */
export function ObligationStatus({ status }: { status: EffectiveObligationStatus }) {
  const strong = status === "OVERDUE" || status === "DUE_SOON";
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: OBLIGATION_STATUS_COLORS[status] }} />
      <Typography component="span" variant="body2" sx={{ fontWeight: strong ? 600 : 400 }} color={status === "CANCELLED" ? "text.secondary" : "text.primary"}>
        {OBLIGATION_STATUS_LABELS[status]}
      </Typography>
    </Box>
  );
}
