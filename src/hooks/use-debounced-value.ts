"use client";

import { useEffect, useState } from "react";

/** Devuelve value recién cuando dejó de cambiar durante delayMs (ej. búsqueda mientras se escribe). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
