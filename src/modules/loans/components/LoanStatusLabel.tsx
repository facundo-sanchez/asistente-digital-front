import Typography from "@mui/material/Typography";
import type { LoanStatus } from "@/types/api";

const LABELS: Record<LoanStatus, { text: string; color: string }> = {
  ACTIVE: { text: "En curso", color: "text.secondary" },
  PAID: { text: "Pagado", color: "success.main" },
  CANCELLED: { text: "Cancelado", color: "text.disabled" },
};

export function LoanStatusLabel({ status }: { status: LoanStatus }) {
  const label = LABELS[status];
  return (
    <Typography component="span" variant="body2" color={label.color} sx={{ fontWeight: status === "PAID" ? 600 : 400 }}>
      {label.text}
    </Typography>
  );
}
