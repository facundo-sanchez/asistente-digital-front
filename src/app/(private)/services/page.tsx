import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddOutlined from "@mui/icons-material/AddOutlined";
import type { PageResponse, ServiceResponse } from "@/types/api";
import { ButtonLink } from "@/components/common/ButtonLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import { toQueryString } from "@/lib/api/query-string";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { ServiceFilters } from "@/modules/services/components/ServiceFilters";
import { ServicesTable } from "@/modules/services/components/ServicesTable";
import { DEFAULT_STATUS, parseFilters, toListParams } from "@/modules/services/service-list-filters";

export const metadata: Metadata = { title: "Servicios" };

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const filters = parseFilters({
    query: firstParam(raw.query),
    category: firstParam(raw.category),
    status: firstParam(raw.status),
    page: firstParam(raw.page),
  });
  const result = await serverGet<PageResponse<ServiceResponse>>(`/services${toQueryString(toListParams(filters))}`);
  const services = result?.content ?? [];
  const hasFilters = !!filters.query || !!filters.category || filters.status !== DEFAULT_STATUS;

  const addButton = (
    <ButtonLink href="/services/new" variant="contained" startIcon={<AddOutlined />}>
      Agregar servicio
    </ButtonLink>
  );

  return (
    <Stack spacing={4} sx={{ maxWidth: 1200 }}>
      <PageHeader title="Servicios" description="Luz, gas, agua, internet y todo lo que pagás todos los meses." action={addButton} />
      <ServiceFilters filters={filters} />
      <Panel
        title={hasFilters ? "Resultados" : "Tus servicios"}
        description={result ? `${result.totalElements} ${result.totalElements === 1 ? "servicio" : "servicios"}` : undefined}
      >
        {services.length > 0 ? (
          <>
            <ServicesTable services={services} />
            <UrlPagination page={filters.page} totalPages={result?.totalPages ?? 0} />
          </>
        ) : (
          <Box sx={{ py: { xs: 2, sm: 4 }, display: "grid", gap: 1.5, justifyItems: "start" }}>
            <Typography sx={{ fontWeight: 600 }}>
              {hasFilters ? "Ningún servicio coincide con los filtros" : "Todavía no registraste servicios"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: "56ch" }}>
              {hasFilters
                ? "Probá con otra búsqueda, otra categoría o el estado «Todos»."
                : "Registrá tus servicios (luz, gas, internet…) con su nro. de socio para empezar a seguir sus facturas y vencimientos."}
            </Typography>
            {hasFilters ? (
              <ButtonLink href="/services" variant="outlined">
                Limpiar filtros
              </ButtonLink>
            ) : (
              addButton
            )}
          </Box>
        )}
      </Panel>
    </Stack>
  );
}
