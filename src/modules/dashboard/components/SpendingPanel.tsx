import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { DashboardSpendingResponse } from "@/types/api";
import { Panel } from "@/components/layout/Panel";
import { visuallyHidden } from "@/components/ledger/ledger-styles";
import { formatMoney } from "@/lib/money";
import { CATEGORY_LABELS, categoryTint } from "@/lib/service-categories";
import { MonthChart } from "./MonthChart";
import { monthLabel } from "./month-label";

/** Lo pagado: barras por mes (últimos 6) y, del mes actual, cuánto fue a cada categoría. Monedas por separado. */
export function SpendingPanel({ spending }: { spending: DashboardSpendingResponse }) {
  const currencies = [...new Set(spending.months.map((m) => m.currency))];
  const pesos = spending.categories.filter((c) => c.currency === "ARS");
  const others = spending.categories.filter((c) => c.currency !== "ARS");
  const top = Math.max(0, ...pesos.map((c) => c.total));

  return (
    <Panel title="Lo que pagaste" description="Pagos registrados en los últimos 6 meses y en qué se fue este mes">
      <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 3fr) minmax(0, 2fr)" } }}>
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          {currencies.map((currency) => {
            const months = spending.months.filter((m) => m.currency === currency);
            return (
              <Box key={currency}>
                {currencies.length > 1 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {currency === "ARS" ? "En pesos" : `En ${currency}`}
                  </Typography>
                )}
                <MonthChart months={months} />
                <Box component="table" sx={visuallyHidden}>
                  <caption>Pagado por mes en {currency}</caption>
                  <tbody>
                    {months.map((m) => (
                      <tr key={m.key}>
                        <th scope="row">{monthLabel(m.key)}</th>
                        <td>{formatMoney(m.total, m.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Box>
              </Box>
            );
          })}
        </Stack>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, mb: 1.5 }}>Este mes, por categoría</Typography>
          {spending.categories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Todavía no registraste pagos este mes.
            </Typography>
          ) : (
            <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
              {pesos.map((c) => (
                <Box component="li" key={c.key}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Typography variant="body2">{CATEGORY_LABELS[c.key]}</Typography>
                    <Typography variant="body2" className="tabular-nums">
                      {formatMoney(c.total, c.currency)}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: "action.hover" }}>
                    <Box
                      sx={{ height: 1, borderRadius: 3, width: `${top > 0 ? (c.total / top) * 100 : 0}%`, bgcolor: categoryTint(c.key) }}
                    />
                  </Box>
                </Box>
              ))}
              {others.map((c) => (
                <Box component="li" key={`${c.key}-${c.currency}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {CATEGORY_LABELS[c.key]} en {c.currency}
                  </Typography>
                  <Typography variant="body2" className="tabular-nums">
                    {formatMoney(c.total, c.currency)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Panel>
  );
}
