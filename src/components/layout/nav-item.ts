/** Ítem del menú lateral. */
export interface NavItem {
  label: string;
  href: string;
  icon: "dashboard" | "services" | "invoices" | "cards" | "obligations" | "documents" | "integrations" | "profile";
}
