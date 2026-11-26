import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CardMerchantRuleResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { ledgerCell, ledgerTable } from "@/components/ledger/ledger-styles";
import { serverGet } from "@/lib/server/server-get";
import { SPENDING_CATEGORY_LABELS } from "@/lib/spending-categories";
import { DeleteRuleButton } from "@/modules/card-transactions/components/DeleteRuleButton";

export const metadata: Metadata = { title: "Rubros por comercio" };

export default async function MerchantRulesPage() {
  const rules = (await serverGet<CardMerchantRuleResponse[]>("/card-merchant-rules")) ?? [];

  return (
    <Stack spacing={4} sx={{ maxWidth: 720 }}>
      <Box>
        <TextLink href="/cards" sx={{ color: "text.secondary" }}>
          Tarjetas
        </TextLink>
        <PageHeader
          title="Rubros por comercio"
          description="Cuando cambiás el rubro de un consumo y elegís «Siempre», lo recordamos para ese comercio."
        />
      </Box>
      <Panel title="Tus reglas">
        {rules.length === 0 ? (
          <Typography color="text.secondary">
            Todavía no hay reglas. Se crean desde los movimientos de un resumen, al cambiar el rubro de un consumo.
          </Typography>
        ) : (
          <Box component="table" sx={ledgerTable}>
            <Box component="tbody">
              {rules.map((rule) => (
                <Box component="tr" key={rule.id}>
                  <Box component="td" sx={ledgerCell}>
                    <Typography sx={{ fontWeight: 600 }}>{rule.merchantName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {SPENDING_CATEGORY_LABELS[rule.category]}
                    </Typography>
                  </Box>
                  <Box component="td" sx={{ ...ledgerCell, textAlign: "right" }}>
                    <DeleteRuleButton id={rule.id} merchant={rule.merchantName} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Panel>
    </Stack>
  );
}
