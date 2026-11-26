import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardResponse, CardSpendingReportResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { visuallyHidden } from "@/components/ledger/ledger-styles";
import { formatMoney } from "@/lib/money";
import type { SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { ReportFilters } from "@/modules/card-transactions/components/ReportFilters";
import { backendParams, detailHref, readReportQuery } from "@/modules/card-transactions/report-query";
import { MonthChart } from "@/modules/dashboard/components/MonthChart";
import { monthLabel } from "@/modules/dashboard/components/month-label";
import { SERVICE_TINTS } from "@/theme/service-tints";

export const metadata: Metadata = { title: "Informe de consumos" };

/** Barra proporcional al mayor de la lista. */
function Bar({ value, max }: { value: number; max: number }) {
  return (
    <Box sx={{ mt: 0.5, height: 6, borderRadius: 3, bgcolor: "action.hover" }}>
      <Box sx={{ height: 1, borderRadius: 3, width: `${max > 0 ? (value / max) * 100 : 0}%`, bgcolor: SERVICE_TINTS.card }} />
    </Box>
  );
}

export default async function CardReportPage({ searchParams }: { searchParams: SearchParams }) {
  const query = readReportQuery(await searchParams);
  const [report, cards] = await Promise.all([
    serverGet<CardSpendingReportResponse>(`/cards/report?${backendParams({ ...query, category: null, merchant: null })}`),
    serverGet<CardResponse[]>("/cards"),
  ]);
  const from = report?.from.slice(0, 7) ?? "";
  const to = report?.to.slice(0, 7) ?? "";
  const period = { ...query, from, to };
  const currencies = report ? [...new Set(report.byMonth.map((m) => m.currency))] : [];
  const pesosCategories = report?.byCategory.filter((c) => c.currency === "ARS") ?? [];
  const maxCategory = Math.max(0, ...pesosCategories.map((c) => c.total));
  const pesosMerchants = report?.topMerchants.filter((m) => m.currency === "ARS") ?? [];
  const maxMerchant = Math.max(0, ...pesosMerchants.map((m) => m.total));

  return (
    <Stack spacing={4} sx={{ maxWidth: 1100 }}>
      <Box>
        <TextLink href="/cards" sx={{ color: "text.secondary" }}>
          Tarjetas
        </TextLink>
        <PageHeader
          title="Informe de consumos"
          description="En qué se fue la plata de la tarjeta, por mes de cierre. Pesos y dólares por separado; solo resúmenes confirmados."
        />
      </Box>
      <ReportFilters query={query} from={from} to={to} cards={cards ?? []} action="" />

      {!report || report.totals.length === 0 ? (
        <Panel title="Sin consumos">
          <Typography color="text.secondary">
            No hay consumos en ese período. Cargá el resumen de tu tarjeta (PDF o Excel) con «Leer con IA» y los movimientos aparecen acá.
          </Typography>
        </Panel>
      ) : (
        <>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {report.totals.map((t) => (
              <Box key={t.currency}>
                <Typography variant="body2" color="text.secondary">
                  Gastaste {t.currency === "ARS" ? "en pesos" : `en ${t.currency}`}
                </Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 600 }} className="tabular-nums">
                  {formatMoney(t.total, t.currency)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.count} consumos
                </Typography>
              </Box>
            ))}
            {report.pendingInstallmentsTotals.map((t) => (
              <Box key={`p-${t.currency}`}>
                <Typography variant="body2" color="text.secondary">
                  Cuotas por pagar {t.currency === "ARS" ? "" : `en ${t.currency}`}
                </Typography>
                <Typography sx={{ fontSize: "1.75rem", fontWeight: 600 }} className="tabular-nums">
                  {formatMoney(t.total, t.currency)}
                </Typography>
                <TextLink href="/cards/installments" variant="body2">
                  Ver las {t.count} compras
                </TextLink>
              </Box>
            ))}
          </Box>

          <Panel title="Por mes" description="Lo consumido en cada resumen, según su mes de cierre">
            <Stack spacing={3}>
              {currencies.map((currency) => {
                const months = report.byMonth
                  .filter((m) => m.currency === currency)
                  .map((m) => ({ key: m.month.slice(0, 7), currency: m.currency, total: m.total }));
                return (
                  <Box key={currency}>
                    {currencies.length > 1 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {currency === "ARS" ? "En pesos" : `En ${currency}`}
                      </Typography>
                    )}
                    <MonthChart months={months} />
                    <Box component="table" sx={visuallyHidden}>
                      <caption>Consumos por mes en {currency}</caption>
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
          </Panel>

          <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" } }}>
            <Panel title="Por rubro" description="En pesos. Tocá un rubro para ver sus consumos">
              <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {pesosCategories.map((c) => (
                  <Box component="li" key={c.category}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <TextLink href={detailHref(period, { category: c.category })} variant="body2">
                        {SPENDING_CATEGORY_LABELS[c.category]}
                      </TextLink>
                      <Typography variant="body2" className="tabular-nums">
                        {formatMoney(c.total, c.currency)}
                      </Typography>
                    </Box>
                    <Bar value={c.total} max={maxCategory} />
                  </Box>
                ))}
              </Stack>
            </Panel>
            <Panel title="Dónde más gastaste" description="Los 10 comercios con más gasto, en pesos">
              <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {pesosMerchants.map((m) => (
                  <Box component="li" key={m.merchant}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <TextLink href={detailHref(period, { merchant: m.merchant })} variant="body2" sx={{ overflowWrap: "anywhere" }}>
                        {m.merchant}
                      </TextLink>
                      <Typography variant="body2" className="tabular-nums" sx={{ whiteSpace: "nowrap" }}>
                        {formatMoney(m.total, m.currency)}
                      </Typography>
                    </Box>
                    <Bar value={m.total} max={maxMerchant} />
                  </Box>
                ))}
              </Stack>
            </Panel>
          </Box>

          {report.byCard.length > 1 && (
            <Panel title="Por tarjeta">
              <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {report.byCard.map((c) => (
                  <Box component="li" key={`${c.cardId}-${c.currency}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Typography variant="body2">{c.cardName}</Typography>
                    <Typography variant="body2" className="tabular-nums">
                      {formatMoney(c.total, c.currency)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Panel>
          )}
          <Box>
            <TextLink href={detailHref(period, {})}>Ver todos los consumos del período</TextLink>
          </Box>
        </>
      )}
    </Stack>
  );
}
