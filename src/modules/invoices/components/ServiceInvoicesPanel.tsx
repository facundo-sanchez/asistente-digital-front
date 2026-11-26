import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { InvoiceResponse, PageResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { TextLink } from "@/components/common/TextLink";
import { Panel } from "@/components/layout/Panel";
import { serverGet } from "@/lib/server/server-get";
import { InvoicesTable } from "./InvoicesTable";

const LIMIT = 10;

/** Últimas facturas del servicio, con acceso a cargar una ya asociada. */
export async function ServiceInvoicesPanel({ serviceId }: { serviceId: string }) {
  const result = await serverGet<PageResponse<InvoiceResponse>>(`/invoices?serviceId=${serviceId}&status=CONFIRMED&size=${LIMIT}`);
  const invoices = result?.content ?? [];
  const total = result?.totalElements ?? 0;

  return (
    <Panel
      title="Facturas"
      description={total > 0 ? `${total} ${total === 1 ? "factura" : "facturas"}` : undefined}
      action={
        <ButtonLink href={`/invoices/new?serviceId=${serviceId}`} variant="outlined" startIcon={<AddOutlined />}>
          Cargar factura
        </ButtonLink>
      }
    >
      {invoices.length > 0 ? (
        <Stack spacing={2}>
          <InvoicesTable invoices={invoices} />
          {total > LIMIT && <TextLink href={`/invoices?serviceId=${serviceId}`}>Ver las {total} facturas</TextLink>}
        </Stack>
      ) : (
        <Typography color="text.secondary" sx={{ maxWidth: "60ch" }}>
          Todavía no cargaste facturas de este servicio. Al cargar una se crea su vencimiento.
        </Typography>
      )}
    </Panel>
  );
}
