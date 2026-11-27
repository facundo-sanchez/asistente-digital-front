import type { EmailCheckInterval } from "@/types/api";

/** Cada cuánto se revisa el correo, en palabras. */
export const EMAIL_CHECK_LABELS: Record<EmailCheckInterval, string> = {
  EVERY_15_MINUTES: "Cada 15 minutos",
  HOURLY: "Cada hora",
  EVERY_6_HOURS: "Cada 6 horas",
  DAILY: "Una vez por día (a las 8)",
  MANUAL: "Solo cuando toco «Revisar ahora»",
};
