import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ProcessingStatus } from "@/types/api";
import { PROCESSING_STATUS_COLORS, PROCESSING_STATUS_LABELS } from "@/lib/processing-labels";

/** Estado de la lectura con IA con palabra y punto (el color nunca va solo). */
export function ProcessingStatusLabel({ status }: { status: ProcessingStatus }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: PROCESSING_STATUS_COLORS[status] }} />
      <Typography component="span" variant="body2" sx={{ fontWeight: status === "REQUIRES_REVIEW" ? 600 : 400 }}>
        {PROCESSING_STATUS_LABELS[status]}
      </Typography>
    </Box>
  );
}
