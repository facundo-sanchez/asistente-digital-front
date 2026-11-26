import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ObligationResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { TintStrip } from "@/components/ledger/TintStrip";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerStripCell, ledgerTable, visuallyHidden } from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { categoryTint } from "@/lib/service-categories";
import { ObligationStatus } from "@/modules/obligations/components/ObligationStatus";
import { ServiceTintLegend } from "./ServiceTintLegend";

/**
 * Lo vencido primero y después lo que vence en los próximos 30 días, como libro de cuentas:
 * franja del color del servicio, vencimiento, lo que falta pagar y estado.
 */
export function UpcomingPanel({ obligations }: { obligations: ObligationResponse[] }) {
  return (
    <Panel
      title="Próximos vencimientos"
      description="Lo vencido y lo que vence en los próximos 30 días"
      action={obligations.length > 0 && <TextLink href="/obligations">Ver todos</TextLink>}
    >
      <Stack spacing={3}>
        {obligations.length === 0 ? (
          <Box sx={{ display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>No vence nada en los próximos 30 días</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "60ch" }}>
              Cargá tus facturas o el resumen de tu tarjeta y cada vencimiento aparece acá con su fecha y su monto.
            </Typography>
            <ButtonLink href="/invoices" variant="outlined">
              Cargar una factura
            </ButtonLink>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={{ ...ledgerTable, minWidth: { sm: 420 } }}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th" scope="col" sx={{ ...ledgerHeadCell, width: 6, p: 0 }}>
                    <Box component="span" sx={visuallyHidden}>
                      Color del servicio
                    </Box>
                  </Box>
                  <Box component="th" scope="col" sx={ledgerHeadCell}>
                    Vencimiento
                  </Box>
                  <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
                    Vence
                  </Box>
                  <Box component="th" scope="col" sx={{ ...ledgerHeadCell, textAlign: "right" }}>
                    Falta pagar
                  </Box>
                  <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
                    Estado
                  </Box>
                </Box>
              </Box>
              <Box component="tbody">
                {obligations.map((o) => (
                  <Box component="tr" key={o.id}>
                    <Box component="td" sx={ledgerStripCell}>
                      <TintStrip color={o.serviceCategory ? categoryTint(o.serviceCategory) : "var(--mui-palette-divider)"} />
                    </Box>
                    <Box component="td" sx={ledgerCell}>
                      <TextLink href={`/obligations/${o.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                        {o.title}
                      </TextLink>
                      <Typography variant="body2" color="text.secondary" className="tabular-nums">
                        {o.serviceName}
                        {/* En el celular la columna Vence no se ve: la fecha va acá */}
                        <Box component="span" sx={{ display: { sm: "none" } }}>
                          {o.serviceName ? " · " : ""}
                          {formatDate(o.dueDate)}
                        </Box>
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }} className="tabular-nums">
                      {formatDate(o.dueDate)}
                    </Box>
                    <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                      {formatMoney(o.balance ?? o.amount, o.currency) ?? "—"}
                    </Box>
                    <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                      <ObligationStatus status={o.effectiveStatus} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
        <ServiceTintLegend />
      </Stack>
    </Panel>
  );
}
