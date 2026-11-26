import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { InvoiceResponse, PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import { toQueryString } from "@/lib/api/query-string";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { InvoiceFilters } from "@/modules/invoices/components/InvoiceFilters";
import { InvoicesTable } from "@/modules/invoices/components/InvoicesTable";
import { hasActiveFilters, parseFilters, toListParams } from "@/modules/invoices/invoice-list-filters";

export const metadata: Metadata = { title: "Facturas" };

export default async function InvoicesPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const filters = parseFilters({
    query: firstParam(raw.query),
    serviceId: firstParam(raw.serviceId),
    from: firstParam(raw.from),
    to: firstParam(raw.to),
    page: firstParam(raw.page),
  });
  const [result, services] = await Promise.all([
    serverGet<PageResponse<InvoiceResponse>>(`/invoices${toQueryString(toListParams(filters))}`),
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  const invoices = result?.content ?? [];
  const filtered = hasActiveFilters(filters);

  const newButton = (
    <ButtonLink href="/invoices/new" variant="contained" startIcon={<AddOutlined />}>
      Cargar factura
    </ButtonLink>
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title="Facturas" description="Las facturas de tus servicios. Cada una genera su vencimiento." action={newButton} />
      <InvoiceFilters filters={filters} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      <Panel
        title={filtered ? "Resultados" : "Tus facturas"}
        description={result ? `${result.totalElements} ${result.totalElements === 1 ? "factura" : "facturas"}` : undefined}
      >
        {invoices.length > 0 ? (
          <>
            <InvoicesTable invoices={invoices} />
            <UrlPagination page={filters.page} totalPages={result?.totalPages ?? 0} />
          </>
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>{filtered ? "Ninguna factura coincide con los filtros" : "Todavía no cargaste facturas"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              {filtered
                ? "Probá con otro número, otro servicio u otro período."
                : "Cargá la factura de luz, gas o internet: queda su vencimiento con el importe y el código de pago a mano."}
            </Typography>
            {filtered ? (
              <ButtonLink href="/invoices" variant="outlined">
                Limpiar filtros
              </ButtonLink>
            ) : (
              newButton
            )}
          </Box>
        )}
      </Panel>
    </Stack>
  );
}
