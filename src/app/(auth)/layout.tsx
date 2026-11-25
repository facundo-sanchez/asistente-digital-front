import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BrandMark } from "@/components/brand/BrandMark";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { ColorModeToggle } from "@/components/theme/ColorModeToggle";

/**
 * Pantallas públicas. En escritorio: panel de tinta con la roseta y el propósito de
 * la app, y el formulario sobre el papel. En mobile: marca arriba y formulario.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", width: "100%", display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(360px, 5fr) 7fr" } }}>
      <Box
        component="section"
        aria-label="Asistente de Vida Digital"
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "rail.background",
          color: "rail.text",
          p: 6,
          overflow: "hidden",
        }}
      >
        <BrandMark tone="rail" />
        <Box sx={{ display: "grid", gap: 4, justifyItems: "start" }}>
          <GuillocheRosette value={null} size={300} lineColor="var(--mui-palette-rail-text)" />
          <Typography
            component="p"
            sx={{ color: "rail.textActive", fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.25, maxWidth: "18ch", textWrap: "balance" }}
          >
            Tus servicios, facturas y vencimientos en un solo lugar.
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "rail.text", maxWidth: "40ch" }}>
          Vos confirmás cada dato: nada se registra sin tu visto bueno.
        </Typography>
      </Box>

      <Box
        component="main"
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 3 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 48 }}>
          <Box sx={{ display: { md: "none" } }}>
            <BrandMark />
          </Box>
          <Box sx={{ ml: "auto" }}>
            <ColorModeToggle />
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
