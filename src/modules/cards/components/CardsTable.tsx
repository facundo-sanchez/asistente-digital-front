import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { CardResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { desktopOnly, ledgerCell, ledgerHeadCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { CARD_BRAND_LABELS } from "@/lib/card-brands";
import { ServiceStatus } from "@/modules/services/components/ServiceStatus";

/** Tarjetas: nombre (marca y terminación), banco y estado. */
export function CardsTable({ cards }: { cards: CardResponse[] }) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={ledgerTable}>
        <Box component="thead">
          <Box component="tr">
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Tarjeta
            </Box>
            <Box component="th" scope="col" sx={{ ...ledgerHeadCell, ...desktopOnly }}>
              Banco
            </Box>
            <Box component="th" scope="col" sx={ledgerHeadCell}>
              Estado
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {cards.map((card) => (
            <Box component="tr" key={card.id}>
              <Box component="td" sx={ledgerCell}>
                <TextLink href={`/cards/${card.id}`} sx={{ fontWeight: 600, color: "text.primary" }}>
                  {card.name}
                </TextLink>
                <Typography variant="body2" color="text.secondary" className="tabular-nums">
                  {CARD_BRAND_LABELS[card.brand]}
                  {card.lastFour ? ` terminada en ${card.lastFour}` : ""}
                  {card.additional ? " · adicional" : ""}
                </Typography>
              </Box>
              <Box component="td" sx={{ ...ledgerCell, ...desktopOnly }}>
                {card.serviceName}
              </Box>
              <Box component="td" sx={ledgerCell}>
                <ServiceStatus active={card.active} feminine />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
