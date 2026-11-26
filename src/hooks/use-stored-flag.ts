"use client";

import { useSyncExternalStore } from "react";

const EVENT = "adv:stored-flag";

function read(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Preferencia sí/no recordada en este navegador (ej. "leer con IA"). En el servidor vale el
 * valor por defecto, así no hay diferencias al hidratar. Sin almacenamiento (modo privado) vale
 * solo mientras dure la página.
 */
export function useStoredFlag(key: string, fallback: boolean): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback);
  const set = (next: boolean) => {
    try {
      window.localStorage.setItem(key, String(next));
    } catch {
      // Sin almacenamiento: no se recuerda
    }
    window.dispatchEvent(new Event(EVENT));
  };
  return [value, set];
}
