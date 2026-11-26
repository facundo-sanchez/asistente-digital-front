/** Marcas de tarjeta (las mismas del backend) con su nombre para mostrar. */
import type { CardBrand } from "@/types/api";

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  AMEX: "American Express",
  CABAL: "Cabal",
  NARANJA: "Naranja",
  DINERS: "Diners",
  OTHER: "Otra",
};
