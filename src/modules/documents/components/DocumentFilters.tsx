"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DOCUMENT_TYPES } from "@/types/api";
import { SearchField } from "@/components/forms/SearchField";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-types";
import type { DocumentFiltersProps } from "./document-filters-props";

/** Búsqueda, tipo y servicio del listado de documentos (guardados en la URL). */
export function DocumentFilters({ filters, services }: DocumentFiltersProps) {
  const { update, isPending } = useUrlFilters();

  return (
    <Box
      role="search"
      aria-busy={isPending}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)" } }}
    >
      <SearchField initialValue={filters.query} placeholder="Título o nombre del archivo" onSearch={(query) => update({ query })} />
      <TextField select label="Tipo" value={filters.documentType ?? ""} onChange={(e) => update({ documentType: e.target.value })}>
        <MenuItem value="">Todos</MenuItem>
        {DOCUMENT_TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {DOCUMENT_TYPE_LABELS[type]}
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
    </Box>
  );
}
