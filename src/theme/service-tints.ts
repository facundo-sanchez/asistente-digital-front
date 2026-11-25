import type { ServiceKind } from "./service-kind";

/**
 * Tintes de "denominación": cada tipo de servicio tiene su color, como cada billete
 * tiene el suyo. Es un código, así que siempre va acompañado de su rótulo (leyenda),
 * nunca como única señal. Mismo tinte en claro y oscuro: se usan como franja o chip.
 */
export const SERVICE_TINTS: Record<ServiceKind, string> = {
  electricity: "#C9772A",
  gas: "#D3A934",
  water: "#5D8A57",
  internet: "#B0597C",
  card: "#3B6A99",
  other: "#7E8C8A",
};

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  electricity: "Luz",
  gas: "Gas",
  water: "Agua",
  internet: "Internet",
  card: "Tarjetas",
  other: "Otros",
};
