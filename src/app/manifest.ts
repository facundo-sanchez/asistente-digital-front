import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/config";

/** App instalable (módulo 15): nombre, íconos de la roseta y colores del tema oscuro. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Asistente de Vida Digital",
    short_name: "Asistente",
    description: "Servicios, facturas, vencimientos y tarjetas en un solo lugar.",
    lang: "es-AR",
    start_url: withBasePath("/dashboard"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#0F2328",
    theme_color: "#0F2328",
    icons: [
      { src: withBasePath("/pwa-icon/192"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: withBasePath("/pwa-icon/512"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: withBasePath("/pwa-icon/maskable"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
