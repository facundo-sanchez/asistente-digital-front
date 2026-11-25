import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ServiceResponse } from "@/types/api";
import { TintStrip } from "@/components/ledger/TintStrip";
import { ledgerHeadCell } from "@/components/ledger/ledger-styles";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { CATEGORY_LABELS, categoryTint } from "@/lib/service-categories";
import { ServiceStatus } from "./ServiceStatus";

const dateFormat = new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

/** "2026-11-25" → "25/11/2026". Las fechas del servicio no tienen hora: se formatean en UTC. */
function formatDate(isoDate: string | null): string | null {
  return isoDate ? dateFormat.format(new Date(`${isoDate}T00:00:00Z`)) : null;
}

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/** Rótulo con el mismo estilo que los encabezados de las tablas (Archivo Narrow). */
const labelSx = {
  fontFamily: ledgerHeadCell.fontFamily,
  fontWeight: ledgerHeadCell.fontWeight,
  fontSize: ledgerHeadCell.fontSize,
  letterSpacing: ledgerHeadCell.letterSpacing,
  textTransform: ledgerHeadCell.textTransform,
  color: ledgerHeadCell.color,
  pt: { xs: 1.5, sm: 1.75 },
} as const;

/** Datos del servicio como lista de definiciones (rótulo y valor). */
export function ServiceDetails({ service }: { service: ServiceResponse }) {
  const rows: [string, ReactNode][] = [
    ["Proveedor", service.providerName],
    [
      "Categoría",
      <Box key="category" component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
        <TintStrip color={categoryTint(service.category)} height={16} />
        {CATEGORY_LABELS[service.category]}
      </Box>,
    ],
    ["Nro. de socio", service.customerReference ? <span className="tabular-nums">{service.customerReference}</span> : EMPTY],
    ["Periodicidad", BILLING_FREQUENCY_LABELS[service.billingFrequency]],
    ["Desde", formatDate(service.startDate) ?? EMPTY],
    ["Hasta", formatDate(service.endDate) ?? EMPTY],
    ["Estado", <ServiceStatus key="status" active={service.active} />],
  ];
  if (service.notes) {
    rows.push(["Notas", <Box key="notes" component="span" sx={{ whiteSpace: "pre-line" }}>{service.notes}</Box>]);
  }

  return (
    <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, columnGap: 3 }}>
      {rows.map(([label, value]) => (
        <Box key={label} sx={{ display: "contents" }}>
          <Typography component="dt" sx={labelSx}>
            {label}
          </Typography>
          <Box component="dd" sx={{ m: 0, py: { xs: 0.5, sm: 1.5 }, borderBottom: { sm: 1 }, borderColor: { sm: "divider" } }}>
            {value}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
