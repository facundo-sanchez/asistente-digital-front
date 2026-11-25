import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** Layout de las pantallas públicas: marca arriba y tarjeta centrada. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        px: 2,
        py: 4,
      }}
    >
      <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
        Asistente de Vida Digital
      </Typography>
      {children}
    </Box>
  );
}
