"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { SERVICE_CATEGORIES } from "@/types/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CATEGORY_LABELS } from "@/lib/service-categories";
import { DEFAULT_STATUS, STATUS_LABELS } from "../service-list-filters";
import type { ServiceStatusFilter } from "../service-status-filter";
import type { ServiceUrlFilters } from "../service-url-filters";

const ALL = "";

/**
 * Búsqueda, categoría y estado del listado. Escriben en la URL: la página se vuelve a
 * renderizar en el servidor y el filtro sobrevive a recargar o compartir el enlace.
 * Cambiar un filtro vuelve a la página 1.
 */
export function ServiceFilters({ filters }: { filters: ServiceUrlFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState(filters.query);
  const debouncedText = useDebouncedValue(text.trim(), 300);

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  // La búsqueda se aplica cuando el usuario deja de escribir
  useEffect(() => {
    if (debouncedText !== filters.query) update({ query: debouncedText });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reacciona al texto ya esperado
  }, [debouncedText]);

  return (
    <Box
      role="search"
      aria-busy={isPending}
      sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)" } }}
    >
      <TextField
        label="Buscar"
        placeholder="Nombre o nro. de socio"
        value={text}
        onChange={(e) => setText(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlined fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField select label="Categoría" value={filters.category ?? ALL} onChange={(e) => update({ category: e.target.value })}>
        <MenuItem value={ALL}>Todas</MenuItem>
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
