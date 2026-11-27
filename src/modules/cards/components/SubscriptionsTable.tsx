import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { CardSubscriptionResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import {
  desktopOnly,
  ledgerCell,
  ledgerHeadCell,
  ledgerTable,
  visuallyHidden,
} from "@/components/ledger/ledger-styles";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { SubscriptionVisibilityButton } from "./SubscriptionVisibilityButton";

/** Lo que se cobra todos los meses: comercio y tarjeta, desde cuándo, último importe y si aumentó. */
export function SubscriptionsTable({
  items,
}: {
  items: CardSubscriptionResponse[];
}) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Comercio
            </Box>
            <Box
              component="th"
              scope="col"
              sx={{ ...ledgerHeadCell, ...desktopOnly }}
            >
              Desde
            </Box>
            <Box
              component="th"
              scope="col"
              sx={{ ...ledgerHeadCell, textAlign: "right" }}
            >
              Último importe
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              <Box component="span" sx={visuallyHidden}>
                Acciones
              </Box>
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {items.map((s) => (
            <Box component="tr" key={`${s.cardId}-${s.currency}-${s.merchant}`}>
              <Box component="td" sx={ledgerCell}>
                <TextLink
                  href={`/cards/transactions?merchant=${encodeURIComponent(s.merchant)}&cardId=${s.cardId}`}
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {s.merchant}
                </TextLink>
                <Typography variant="body2" color="text.secondary">
                  {s.cardName} · {SPENDING_CATEGORY_LABELS[s.category]} ·{" "}
                  {s.months} {s.months === 1 ? "mes" : "meses"}
                </Typography>
              </Box>
              <Box
                component="td"
                sx={{ ...ledgerCell, ...desktopOnly, whiteSpace: "nowrap" }}
                className="tabular-nums"
              >
                {formatDate(s.since)}
              </Box>
              <Box
                component="td"
                sx={{ ...ledgerCell, textAlign: "right", whiteSpace: "nowrap" }}
                className="tabular-nums"
              >
                {formatMoney(s.lastAmount, s.currency)}
                {s.increase !== null && (
                  <Typography
                    variant="body2"
                    sx={{ color: "warning.main", fontWeight: 600 }}
                  >
                    +{s.increase} % este mes
                  </Typography>
                )}
              </Box>
              <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }}>
                <SubscriptionVisibilityButton
                  merchant={s.merchant}
                  hidden={false}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
