"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { SERVICE_CATEGORIES } from "@/types/api";
import { SearchField } from "@/components/forms/SearchField";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { CATEGORY_LABELS } from "@/lib/service-categories";
import { DEFAULT_STATUS, STATUS_LABELS } from "../service-list-filters";
import type { ServiceStatusFilter } from "../service-status-filter";
import type { ServiceUrlFilters } from "../service-url-filters";

/** Búsqueda, categoría y estado del listado de servicios (guardados en la URL). */
export function ServiceFilters({ filters }: { filters: ServiceUrlFilters }) {
  const { update, isPending } = useUrlFilters();

  return (
    <Box
      role="search"
      aria-busy={isPending}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)" } }}
    >
      <SearchField initialValue={filters.query} placeholder="Nombre o nro. de socio" onSearch={(query) => update({ query })} />
      <TextField select label="Categoría" value={filters.category ?? ""} onChange={(e) => update({ category: e.target.value })}>
        <MenuItem value="">Todas</MenuItem>
        {SERVICE_CATEGORIES.map((category) => (
          <MenuItem key={category} value={category}>
            {CATEGORY_LABELS[category]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Estado"
        value={filters.status}
        onChange={(e) => {
          const status = e.target.value as ServiceStatusFilter;
          update({ status: status === DEFAULT_STATUS ? "" : status });
        }}
      >
        {(Object.keys(STATUS_LABELS) as ServiceStatusFilter[]).map((status) => (
          <MenuItem key={status} value={status}>
            {STATUS_LABELS[status]}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
