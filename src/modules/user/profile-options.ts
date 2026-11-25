/** Opciones de los selectores del perfil. */

export const LOCALE_OPTIONS = [
  { value: "es-AR", label: "Español (Argentina)" },
  { value: "es-ES", label: "Español (España)" },
  { value: "en-US", label: "English (US)" },
  { value: "pt-BR", label: "Português (Brasil)" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "ARS", label: "ARS · Peso argentino" },
  { value: "USD", label: "USD · Dólar estadounidense" },
  { value: "EUR", label: "EUR · Euro" },
  { value: "BRL", label: "BRL · Real" },
  { value: "UYU", label: "UYU · Peso uruguayo" },
  { value: "CLP", label: "CLP · Peso chileno" },
] as const;

/** Zonas horarias IANA disponibles en el entorno, con las de Argentina primero. */
export function timezoneOptions(): string[] {
  const all = typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [];
  const argentina = all.filter((z) => z.startsWith("America/Argentina/"));
  return [...argentina, ...all.filter((z) => !z.startsWith("America/Argentina/"))];
}
