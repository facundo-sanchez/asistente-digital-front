import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { ObligationResponse, PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import { toQueryString } from "@/lib/api/query-string";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { ObligationFilters } from "@/modules/obligations/components/ObligationFilters";
import { ObligationsTable } from "@/modules/obligations/components/ObligationsTable";
import { hasActiveFilters, parseFilters, toListParams } from "@/modules/obligations/obligation-list-filters";

export const metadata: Metadata = { title: "Vencimientos" };

export default async function ObligationsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const filters = parseFilters({
    query: firstParam(raw.query),
    status: firstParam(raw.status),
    serviceId: firstParam(raw.serviceId),
    category: firstParam(raw.category),
    from: firstParam(raw.from),
    to: firstParam(raw.to),
    page: firstParam(raw.page),
  });
  const [result, services] = await Promise.all([
    serverGet<PageResponse<ObligationResponse>>(`/obligations${toQueryString(toListParams(filters))}`),
    // Para el filtro por servicio: todos los servicios del usuario, activos o no
    serverGet<PageResponse<ServiceResponse>>("/services?size=100"),
  ]);
  const obligations = result?.content ?? [];
  const filtered = hasActiveFilters(filters);

  const newButton = (
    <ButtonLink href="/obligations/new" variant="contained" startIcon={<AddOutlined />}>
      Nuevo vencimiento
    </ButtonLink>
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title="Vencimientos" description="Lo que tenés que pagar o renovar, ordenado por fecha." action={newButton} />
      <ObligationFilters filters={filters} services={(services?.content ?? []).map(({ id, name }) => ({ id, name }))} />
      <Panel
        title={filtered ? "Resultados" : "Por pagar"}
        description={result ? `${result.totalElements} ${result.totalElements === 1 ? "vencimiento" : "vencimientos"}` : undefined}
      >
        {obligations.length > 0 ? (
          <>
            <ObligationsTable obligations={obligations} />
            <UrlPagination page={filters.page} totalPages={result?.totalPages ?? 0} />
          </>
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>
              {filtered ? "Ningún vencimiento coincide con los filtros" : "No tenés nada pendiente"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              {filtered
                ? "Probá con otro estado, otro servicio u otro período."
                : "Cargá la VTV, los impuestos o el seguro para que no se te pase ninguna fecha."}
            </Typography>
            {filtered ? (
              <ButtonLink href="/obligations" variant="outlined">
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
