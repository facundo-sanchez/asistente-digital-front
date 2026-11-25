/** Ítem del menú lateral. */
export interface NavItem {
  label: string;
  href: string;
  icon: "dashboard" | "services" | "obligations" | "documents" | "profile";
}
