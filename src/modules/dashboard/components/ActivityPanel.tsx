import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { DashboardActivityResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { ledgerCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { formatMoney } from "@/lib/money";

const KIND: Record<DashboardActivityResponse["kind"], { label: string; href: (a: DashboardActivityResponse) => string }> = {
  PAYMENT: { label: "Pago", href: (a) => `/obligations/${a.linkId}` },
  INVOICE: { label: "Factura", href: (a) => `/invoices/${a.linkId}` },
  STATEMENT: { label: "Resumen de tarjeta", href: (a) => `/cards/${a.linkId}` },
  DOCUMENT: { label: "Documento", href: (a) => `/documents/${a.linkId}` },
};

/** Lo último que registraste, con acceso a cada cosa. No se muestra si no hay nada. */
export function ActivityPanel({ activity, timeZone }: { activity: DashboardActivityResponse[]; timeZone: string }) {
  if (activity.length === 0) return null;
  const when = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone });
  return (
    <Panel title="Últimas actividades" description="Lo último que registraste">
      <Box component="table" sx={ledgerTable}>
        <Box component="tbody">
          {activity.map((a) => (
            <Box component="tr" key={`${a.kind}-${a.id}`}>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={KIND[a.kind].href(a)} sx={{ fontWeight: 600, color: "text.primary" }}>
                  {a.title}
                </TextLink>
                <Typography variant="body2" color="text.secondary" className="tabular-nums">
                  {KIND[a.kind].label} · {when.format(new Date(a.at))}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }} className="tabular-nums">
                {a.amount !== null && a.currency ? formatMoney(a.amount, a.currency) : ""}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  );
}
