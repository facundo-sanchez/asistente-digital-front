import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ServiceResponse } from "@/types/api";
import { DetailList } from "@/components/layout/DetailList";
import { TintStrip } from "@/components/ledger/TintStrip";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { formatDate } from "@/lib/dates";
import { CATEGORY_LABELS, categoryTint } from "@/lib/service-categories";
import { ServiceStatus } from "./ServiceStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

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

  return <DetailList rows={rows} />;
}
