/** Rubros de los consumos con tarjeta (los mismos del backend) con su nombre en español. */
import type { SpendingCategory } from "@/types/api";

export const SPENDING_CATEGORY_LABELS: Record<SpendingCategory, string> = {
  SUPERMARKET: "Supermercado",
  RESTAURANTS: "Restaurantes y delivery",
  FUEL: "Combustible",
  TRANSPORT: "Transporte",
  HEALTH: "Salud",
  EDUCATION: "Educación",
  ENTERTAINMENT: "Entretenimiento",
  TRAVEL: "Viajes",
  CLOTHING: "Ropa",
  HOME: "Hogar",
  TECHNOLOGY: "Tecnología",
  SERVICES: "Servicios",
  SUBSCRIPTIONS: "Suscripciones",
  TAXES_FEES: "Impuestos y cargos",
  OTHER: "Otros",
};
