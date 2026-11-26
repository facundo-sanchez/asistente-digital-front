"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { SERVICE_CATEGORIES } from "@/types/api";
import { SearchField } from "@/components/forms/SearchField";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { CATEGORY_LABELS } from "@/lib/service-categories";
import { DEFAULT_STATUS, STATUS_FILTER_LABELS } from "../obligation-list-filters";
import type { ObligationStatusFilter } from "../obligation-status-filter";
import type { ObligationFiltersProps } from "./obligation-filters-props";

const dateSlotProps = { inputLabel: { shrink: true } };

/** Búsqueda, estado, servicio, categoría y período del listado de vencimientos (guardados en la URL). */
export function ObligationFilters({ filters, services }: ObligationFiltersProps) {
  const { update, isPending } = useUrlFilters();

  return (
    <Box
      role="search"
      aria-busy={isPending}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))" } }}
    >
      <SearchField initialValue={filters.query} placeholder="Título" onSearch={(query) => update({ query })} />
      <TextField
        select
        label="Estado"
        value={filters.status}
        onChange={(e) => {
          const status = e.target.value as ObligationStatusFilter;
          update({ status: status === DEFAULT_STATUS ? "" : status });
        }}
      >
        {(Object.keys(STATUS_FILTER_LABELS) as ObligationStatusFilter[]).map((status) => (
          <MenuItem key={status} value={status}>
            {STATUS_FILTER_LABELS[status]}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Servicio" value={filters.serviceId ?? ""} onChange={(e) => update({ serviceId: e.target.value })}>
        <MenuItem value="">Todos</MenuItem>
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField select label="Categoría" value={filters.category ?? ""} onChange={(e) => update({ category: e.target.value })}>
        <MenuItem value="">Todas</MenuItem>
        {SERVICE_CATEGORIES.map((category) => (
          <MenuItem key={category} value={category}>
            {CATEGORY_LABELS[category]}
          </MenuItem>
        ))}
      </TextField>
      <TextField type="date" label="Vence desde" value={filters.from ?? ""} onChange={(e) => update({ from: e.target.value })} slotProps={dateSlotProps} />
      <TextField type="date" label="Vence hasta" value={filters.to ?? ""} onChange={(e) => update({ to: e.target.value })} slotProps={dateSlotProps} />
    </Box>
  );
}
