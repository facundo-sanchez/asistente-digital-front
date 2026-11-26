import type { NavItem } from "./nav-item";

/**
 * Ítems del menú lateral. Los módulos se agregan acá a medida que se desarrollan
 * (ver docs/ROADMAP-MODULOS.md).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: "dashboard" },
  { label: "Servicios", href: "/services", icon: "services" },
  { label: "Vencimientos", href: "/obligations", icon: "obligations" },
  { label: "Documentos", href: "/documents", icon: "documents" },
  { label: "Mi perfil", href: "/profile", icon: "profile" },
];
