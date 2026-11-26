import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { RecurringRuleResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { Panel } from "@/components/layout/Panel";
import { BILLING_FREQUENCY_LABELS } from "@/lib/billing-frequencies";
import { formatDate } from "@/lib/dates";
import { formatMoney } from "@/lib/money";
import { serverGet } from "@/lib/server/server-get";
import { RecurrenceStatusAction } from "./RecurrenceStatusAction";

/** "Mensual, el día 10" / "Semanal". */
function describe(rule: RecurringRuleResponse): string {
  const frequency = BILLING_FREQUENCY_LABELS[rule.frequency];
  return rule.dayOfMonth ? `${frequency}, el día ${rule.dayOfMonth}` : frequency;
}

/** Repetición de la que salió este vencimiento: cada cuánto, el próximo período y acciones. */
export async function RecurrencePanel({ ruleId }: { ruleId: string }) {
  const rule = await serverGet<RecurringRuleResponse>(`/recurring-rules/${ruleId}`);
  if (!rule) return null;
  const amount = formatMoney(rule.amount, rule.currency);

  return (
    <Panel
      title="Se repite"
      action={
        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap", alignItems: "flex-start" }}>
          <ButtonLink href={`/recurring-rules/${rule.id}/edit`} variant="outlined">
            Editar repetición
          </ButtonLink>
          <RecurrenceStatusAction ruleId={rule.id} active={rule.active} />
        </Stack>
      }
    >
      <Stack spacing={0.5}>
        <Typography sx={{ fontWeight: 600 }}>{describe(rule)}</Typography>
        <Typography variant="body2" color="text.secondary">
          {rule.active
            ? `Próximo vencimiento: ${formatDate(rule.nextExpectedDate)}${amount ? ` por ${amount}` : ""}. Aparece solo 20 días antes.`
            : "No se generan más vencimientos. Los ya creados se conservan."}
        </Typography>
      </Stack>
    </Panel>
  );
}
