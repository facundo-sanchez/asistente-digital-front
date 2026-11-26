import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { ObligationResponse, PageResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { ObligationsTable } from "./ObligationsTable";

const LIMIT = 10;

/** Vencimientos de un servicio (los de cualquier estado, por fecha), con acceso a cargar uno ya asociado. */
export async function ServiceObligationsPanel({ serviceId }: { serviceId: string }) {
  const result = await serverGet<PageResponse<ObligationResponse>>(`/obligations?serviceId=${serviceId}&size=${LIMIT}`);
  const obligations = result?.content ?? [];
  const total = result?.totalElements ?? 0;

  return (
    <Panel
      title="Vencimientos"
      description={total > 0 ? `${total} ${total === 1 ? "vencimiento" : "vencimientos"}` : undefined}
      action={
        <ButtonLink href={`/obligations/new?serviceId=${serviceId}`} variant="outlined" startIcon={<AddOutlined />}>
          Nuevo vencimiento
        </ButtonLink>
      }
    >
      {obligations.length > 0 ? (
        <Stack spacing={2}>
          <ObligationsTable obligations={obligations} />
          {total > LIMIT && (
            <TextLink href={`/obligations?serviceId=${serviceId}&status=all`}>Ver los {total} vencimientos</TextLink>
          )}
        </Stack>
      ) : (
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no hay vencimientos de este servicio. Cargá el próximo para tener a mano su importe, fecha y pagos.
        </Typography>
      )}
    </Panel>
  );
}
