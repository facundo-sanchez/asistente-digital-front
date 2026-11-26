"use client";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { SearchField } from "@/components/forms/SearchField";
import { useUrlFilters } from "@/hooks/use-url-filters";
import type { InvoiceFiltersProps } from "./invoice-filters-props";

const dateSlotProps = { inputLabel: { shrink: true } };

/** Búsqueda por número, servicio y período del listado de facturas (guardados en la URL). */
export function InvoiceFilters({ filters, services }: InvoiceFiltersProps) {
  const { update, isPending } = useUrlFilters();

  return (
    <Box
      role="search"
      aria-busy={isPending}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "minmax(0, 2fr) repeat(3, minmax(0, 1fr))" } }}
    >
      <SearchField initialValue={filters.query} placeholder="Número de factura" onSearch={(query) => update({ query })} />
      <TextField select label="Servicio" value={filters.serviceId ?? ""} onChange={(e) => update({ serviceId: e.target.value })}>
        <MenuItem value="">Todos</MenuItem>
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField type="date" label="Vence desde" value={filters.from ?? ""} onChange={(e) => update({ from: e.target.value })} slotProps={dateSlotProps} />
      <TextField type="date" label="Vence hasta" value={filters.to ?? ""} onChange={(e) => update({ to: e.target.value })} slotProps={dateSlotProps} />
    </Box>
  );
}
