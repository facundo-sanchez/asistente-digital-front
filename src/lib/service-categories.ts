/**
 * Categorías de servicio (las mismas del backend) con su nombre en español y su tinte.
 * Un solo lugar para que proveedores, servicios y facturas las muestren igual.
 */
import type { ServiceCategory } from "@/types/api";
import type { ServiceKind } from "@/theme/service-kind";
import { SERVICE_TINTS } from "@/theme/service-tints";

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  ELECTRICITY: "Luz",
  GAS: "Gas",
  WATER: "Agua",
  INTERNET: "Internet",
  PHONE: "Teléfono",
  TV: "Televisión",
  INSURANCE: "Seguros",
  TAX: "Impuestos",
  SUBSCRIPTION: "Suscripciones",
  HEALTH: "Salud",
  EDUCATION: "Educación",
  RENT: "Alquiler",
  CREDIT_CARD: "Tarjetas",
  OTHER: "Otros",
};

/** Las 14 categorías se agrupan en los 6 tintes del sistema de diseño (DESIGN.md). */
const CATEGORY_KIND: Record<ServiceCategory, ServiceKind> = {
  ELECTRICITY: "electricity",
  GAS: "gas",
  WATER: "water",
  INTERNET: "internet",
  PHONE: "internet",
  TV: "internet",
  CREDIT_CARD: "card",
  INSURANCE: "other",
  TAX: "other",
  SUBSCRIPTION: "other",
  HEALTH: "other",
  EDUCATION: "other",
  RENT: "other",
  OTHER: "other",
};

export function categoryKind(category: ServiceCategory): ServiceKind {
  return CATEGORY_KIND[category];
}

export function categoryTint(category: ServiceCategory): string {
  return SERVICE_TINTS[CATEGORY_KIND[category]];
}
