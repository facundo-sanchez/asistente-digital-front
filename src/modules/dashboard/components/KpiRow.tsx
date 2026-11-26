import Box from "@mui/material/Box";
import type { DashboardSummaryResponse } from "@/types/api";
import { formatMoney } from "@/lib/money";
import { KpiTile } from "./KpiTile";

/** Los indicadores del Inicio (CU-012): falta pagar del mes, vencido, vence pronto y servicios activos. */
export function KpiRow({ summary }: { summary: DashboardSummaryResponse }) {
  const pesos = summary.month.find((m) => m.currency === "ARS");
  const others = summary.month.filter((m) => m.currency !== "ARS");
  const overdueCount = summary.overdue.reduce((n, o) => n + o.count, 0);
  const monthFilter = `from=${summary.monthStart}&to=${summary.monthEnd}`;

  return (
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
      <KpiTile
        label="Falta pagar este mes"
        value={formatMoney(pesos?.pending ?? 0, "ARS")}
        detail={others.map((m) => `y ${formatMoney(m.pending, m.currency)}`).join(" ") || (pesos ? `de ${formatMoney(pesos.total, "ARS")}` : "Nada cargado este mes")}
        href={`/obligations?${monthFilter}`}
      />
      <KpiTile
        label="Vencido"
        value={overdueCount === 0 ? "Nada" : summary.overdue.map((o) => formatMoney(o.balance, o.currency)).join(" · ")}
        detail={overdueCount === 0 ? "Estás al día" : `${overdueCount} ${overdueCount === 1 ? "vencimiento" : "vencimientos"} sin pagar`}
        href="/obligations?status=overdue"
        alert={overdueCount > 0}
      />
      <KpiTile
        label="Vence en 7 días"
        value={summary.dueSoon}
        detail={summary.dueSoon === 1 ? "vencimiento" : "vencimientos"}
        href="/obligations?status=due_soon"
      />
      <KpiTile label="Servicios activos" value={summary.activeServices} detail="luz, gas, tarjetas…" href="/services" />
    </Box>
  );
}
