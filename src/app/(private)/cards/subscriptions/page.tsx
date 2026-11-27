import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardResponse, CardSubscriptionsResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatMoney } from "@/lib/money";
import type { SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { SubscriptionVisibilityButton } from "@/modules/cards/components/SubscriptionVisibilityButton";
import { SubscriptionsTable } from "@/modules/cards/components/SubscriptionsTable";

export const metadata: Metadata = { title: "Suscripciones" };

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const cardId =
    typeof params.cardId === "string" && isUuid(params.cardId)
      ? params.cardId
      : undefined;
  const [subscriptions, cards] = await Promise.all([
    serverGet<CardSubscriptionsResponse>(
      `/cards/subscriptions${cardId ? `?cardId=${cardId}` : ""}`,
    ),
    serverGet<CardResponse[]>("/cards"),
  ]);
  const items = subscriptions?.items ?? [];
  const hidden = subscriptions?.hidden ?? [];

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <Box>
        <TextLink href="/cards" sx={{ color: "text.secondary" }}>
          Tarjetas
        </TextLink>
        <PageHeader
          title="Suscripciones"
          description="Lo que se cobra todos los meses en tus tarjetas, según tus últimos resúmenes confirmados."
        />
      </Box>
      {(cards?.length ?? 0) > 1 && (
        <Box
          component="nav"
          aria-label="Filtrar por tarjeta"
          sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}
        >
          <TextLink
            href="/cards/subscriptions"
            aria-current={!cardId ? "page" : undefined}
            sx={{ fontWeight: !cardId ? 700 : 400 }}
          >
            Todas
          </TextLink>
          {cards!.map((c) => (
            <TextLink
              key={c.id}
              href={`/cards/subscriptions?cardId=${c.id}`}
              aria-current={cardId === c.id ? "page" : undefined}
              sx={{ fontWeight: cardId === c.id ? 700 : 400 }}
            >
              {c.name}
            </TextLink>
          ))}
        </Box>
      )}
      {subscriptions && subscriptions.totals.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {subscriptions.totals.map((t) => (
            <Box key={t.currency}>
              <Typography variant="body2" color="text.secondary">
                Por mes {t.currency === "ARS" ? "en pesos" : `en ${t.currency}`}
              </Typography>
              <Typography
                sx={{ fontSize: "1.5rem", fontWeight: 600 }}
                className="tabular-nums"
              >
                {formatMoney(t.total, t.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t.count} {t.count === 1 ? "suscripción" : "suscripciones"}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Panel title="Se cobran todos los meses">
        {items.length === 0 ? (
          <Typography color="text.secondary">
            Necesitamos al menos 3 resúmenes confirmados para reconocer lo que
            se cobra todos los meses.
          </Typography>
        ) : (
          <SubscriptionsTable items={items} />
        )}
      </Panel>
      {hidden.length > 0 && (
        <Panel
          title={`Ocultas (${hidden.length})`}
          description="Los comercios que marcaste como que no son una suscripción."
        >
          <Box
            component="ul"
            sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1 }}
          >
            {hidden.map((merchant) => (
              <Box
                component="li"
                key={merchant}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography>{merchant}</Typography>
                <SubscriptionVisibilityButton merchant={merchant} hidden />
              </Box>
            ))}
          </Box>
        </Panel>
      )}
    </Stack>
  );
}
