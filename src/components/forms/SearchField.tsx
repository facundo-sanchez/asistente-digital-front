"use client";

import { useEffect, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SearchFieldProps } from "./search-field-props";

/** Caja de búsqueda de un listado: avisa el texto recién cuando el usuario deja de escribir. */
export function SearchField({ initialValue, placeholder, onSearch }: SearchFieldProps) {
  const [text, setText] = useState(initialValue);
  const debounced = useDebouncedValue(text.trim(), 300);

  useEffect(() => {
    if (debounced !== initialValue) onSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo reacciona al texto ya esperado
  }, [debounced]);

  return (
    <TextField
      label="Buscar"
      placeholder={placeholder}
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
  );
}
