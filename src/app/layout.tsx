import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Nunito } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Asistente de Vida Digital", template: "%s · Asistente de Vida Digital" },
  description: "Servicios, facturas, vencimientos y documentos en un solo lugar.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* enableCssLayer: los estilos de MUI van en la capa "mui" y Tailwind puede sobrescribirlos */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <AppProviders>{children}</AppProviders>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
