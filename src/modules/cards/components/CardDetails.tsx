import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import type { CardResponse } from "@/types/api";
import { DetailList } from "@/components/layout/DetailList";
import { CARD_BRAND_LABELS } from "@/lib/card-brands";
import { formatMoney } from "@/lib/money";
import { ServiceStatus } from "@/modules/services/components/ServiceStatus";

const EMPTY = (
  <Typography component="span" color="text.secondary">
    —
  </Typography>
);

/** Datos de la tarjeta. Cierre y vencimiento se ven en cada resumen (los fija el banco). */
export function CardDetails({ card }: { card: CardResponse }) {
  const rows: [string, ReactNode][] = [
    ["Banco", card.serviceName],
    ["Marca", CARD_BRAND_LABELS[card.brand]],
    ["Terminación", card.lastFour ? <span className="tabular-nums">{card.lastFour}</span> : EMPTY],
    ["Cuenta", card.accountLastFour ? <span className="tabular-nums">{card.accountLastFour}</span> : EMPTY],
    ["Titular", card.holderName ? `${card.holderName}${card.additional ? " (adicional)" : ""}` : card.additional ? "Adicional" : EMPTY],
    ["Límite", formatMoney(card.creditLimit, card.currency) ?? EMPTY],
    ["Estado", <ServiceStatus key="status" active={card.active} feminine />],
  ];
  return <DetailList rows={rows} />;
}
