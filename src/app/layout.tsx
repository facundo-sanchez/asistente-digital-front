import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, Archivo_Narrow } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"] });
const archivoNarrow = Archivo_Narrow({ variable: "--font-archivo-narrow", subsets: ["latin"], weight: ["500", "600"] });

export const metadata: Metadata = {
  title: { default: "Asistente de Vida Digital", template: "%s · Asistente de Vida Digital" },
  description: "Servicios, facturas, vencimientos y documentos en un solo lugar.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E9EFEB" },
    { media: "(prefers-color-scheme: dark)", color: "#0F2328" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: InitColorSchemeScript agrega la clase del modo antes de hidratar
    <html lang="es" className={`${archivo.variable} ${archivoNarrow.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        {/* Aplica el modo guardado (o el del sistema) antes de pintar: sin destello de tema */}
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        {/* enableCssLayer: los estilos de MUI van en la capa "mui" y Tailwind puede sobrescribirlos */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
