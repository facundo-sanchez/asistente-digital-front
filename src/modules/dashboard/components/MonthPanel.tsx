import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { DashboardSummaryResponse } from "@/types/api";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { formatMoney } from "@/lib/money";

/** "Este mes": cuánto de lo que vence en el mes ya está pagado, en la roseta (en pesos; los dólares, aparte). */
export function MonthPanel({ summary }: { summary: DashboardSummaryResponse }) {
  const pesos = summary.month.find((m) => m.currency === "ARS");
  const others = summary.month.filter((m) => m.currency !== "ARS");
  const fraction = pesos && pesos.total > 0 ? Math.min(pesos.paid / pesos.total, 1) : null;
  const percent = fraction === null ? null : Math.round(fraction * 100);

  return (
    <Panel title="Este mes" description="Cuánto del mes ya pagaste">
      <Box sx={{ display: "grid", justifyItems: "center", gap: 2, py: 1, textAlign: "center" }}>
        <GuillocheRosette
          value={fraction}
          size={200}
          label={percent === null ? "Todavía no hay vencimientos con importe este mes" : `Pagaste el ${percent} % de lo que vence este mes`}
        />
        {pesos ? (
          <Box>
            <Typography sx={{ fontWeight: 600 }} className="tabular-nums">
              {percent} % pagado
            </Typography>
            <Typography variant="body2" color="text.secondary" className="tabular-nums" sx={{ mt: 0.5 }}>
              {formatMoney(pesos.paid, "ARS")} de {formatMoney(pesos.total, "ARS")}
            </Typography>
            {others.map((m) => (
              <Typography key={m.currency} variant="body2" color="text.secondary" className="tabular-nums">
                En dólares: {formatMoney(m.paid, m.currency)} de {formatMoney(m.total, m.currency)}
              </Typography>
            ))}
            {summary.withoutAmount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: "32ch", mx: "auto" }}>
                {summary.withoutAmount} {summary.withoutAmount === 1 ? "vencimiento no tiene" : "vencimientos no tienen"} importe cargado.
              </Typography>
            )}
          </Box>
        ) : (
          <Box>
            <Typography sx={{ fontWeight: 600 }}>Sin vencimientos este mes</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: "32ch", mx: "auto" }}>
              Cargá una factura o un vencimiento y la roseta se completa a medida que pagás.
            </Typography>
          </Box>
        )}
        <TextLink href={`/obligations?from=${summary.monthStart}&to=${summary.monthEnd}&status=all`}>Ver los vencimientos del mes</TextLink>
      </Box>
    </Panel>
  );
}
