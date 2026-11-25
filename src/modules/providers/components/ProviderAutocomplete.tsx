"use client";

import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ProviderResponse } from "@/types/api";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { CATEGORY_LABELS, categoryTint } from "@/lib/service-categories";
import { providersApi } from "../api";
import { CreateProviderDialog } from "./CreateProviderDialog";
import type { ProviderAutocompleteProps } from "./provider-autocomplete-props";
import type { ProviderSearchResult } from "./provider-search-result";

const SEARCH_DELAY_MS = 250;
const MAX_OPTIONS = 20;

/** Agrupado por categoría (en orden) y por nombre dentro de cada una: MUI necesita los grupos contiguos. */
function byCategoryThenName(a: ProviderResponse, b: ProviderResponse): number {
  const byCategory = CATEGORY_LABELS[a.category].localeCompare(CATEGORY_LABELS[b.category], "es");
  return byCategory !== 0 ? byCategory : a.name.localeCompare(b.name, "es");
}

/**
 * Elegir un proveedor del catálogo (o uno propio) buscando por nombre. La búsqueda la
 * hace el backend; acá se espera a que el usuario deje de escribir y se descartan las
 * respuestas que llegan tarde.
 */
export function ProviderAutocomplete({
  value,
  onChange,
  onBlur,
  label = "Proveedor",
  error,
  helperText,
  disabled,
  required,
}: ProviderAutocompleteProps) {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<ProviderSearchResult | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const query = useDebouncedValue(inputValue.trim(), SEARCH_DELAY_MS);

  useEffect(() => {
    // stale: el usuario siguió escribiendo; esta respuesta ya no corresponde
    let stale = false;
    providersApi
      .list({ query, size: MAX_OPTIONS })
      .then((page) => {
        if (!stale) setResult({ query, options: [...page.content].sort(byCategoryThenName), failed: false });
      })
      .catch(() => {
        if (!stale) setResult({ query, options: [], failed: true });
      });
    return () => {
      stale = true;
    };
  }, [query]);

  // Cargando mientras el último resultado sea de otra búsqueda
  const loading = result?.query !== query;
  const options = result?.options ?? [];
  const loadError = !loading && !!result?.failed;

  const noOptionsText = query ? `No encontramos «${query}» en el catálogo` : "Escribí el nombre de tu proveedor";

  return (
    <Box>
      <Autocomplete
        value={value}
        onChange={(_, provider) => onChange(provider)}
        onBlur={onBlur}
        inputValue={inputValue}
        onInputChange={(_, text) => setInputValue(text)}
        options={value && !options.some((o) => o.id === value.id) ? [value, ...options] : options}
        // El filtrado lo hace el backend
        filterOptions={(list) => list}
        groupBy={(option) => CATEGORY_LABELS[option.category]}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        loading={loading}
        loadingText="Buscando proveedores…"
        noOptionsText={noOptionsText}
        disabled={disabled}
        renderOption={({ key, ...props }, option) => (
          <Box component="li" key={key} {...props} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box component="span" aria-hidden sx={{ width: 4, height: 20, borderRadius: 0.5, flexShrink: 0, bgcolor: categoryTint(option.category) }} />
            <Typography component="span" sx={{ flexGrow: 1 }}>
              {option.name}
            </Typography>
            {option.custom && (
              <Typography component="span" variant="body2" color="text.secondary">
                Propio
              </Typography>
            )}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            error={!!error || loadError}
            helperText={error ?? (loadError ? "No pudimos cargar los proveedores. Probá de nuevo." : helperText)}
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={18} aria-label="Buscando" />}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      <Button size="small" onClick={() => setCreateOpen(true)} disabled={disabled} sx={{ mt: 0.5, ml: -0.5 }}>
        ¿No está tu proveedor? Crealo
      </Button>
      <CreateProviderDialog
        open={createOpen}
        initialName={inputValue.trim()}
        onClose={() => setCreateOpen(false)}
        onCreated={(provider) => {
          setCreateOpen(false);
          onChange(provider);
        }}
      />
    </Box>
  );
}
