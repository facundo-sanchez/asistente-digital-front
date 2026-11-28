import Typography from "@mui/material/Typography";
import type { CardSubscriptionsResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { formatMoney } from "@/lib/money";

/** "Suscripciones: $ 28.400 por mes" en el inicio. No se muestra si no hay ninguna. */
export function SubscriptionsLine({
  subscriptions,
}: {
  subscriptions: CardSubscriptionsResponse | null;
}) {
  if (!subscriptions || subscriptions.totals.length === 0) return null;
  return (
    <Typography className="tabular-nums">
      <TextLink href="/cards/subscriptions" sx={{ fontWeight: 600 }}>
        Suscripciones
      </TextLink>
      :{" "}
      {subscriptions.totals
        .map((t) => formatMoney(t.total, t.currency))
        .join(" y ")}{" "}
      por mes
    </Typography>
  );
}
