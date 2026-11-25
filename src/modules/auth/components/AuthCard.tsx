import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { AuthCardProps } from "./auth-card-props";

/** Bloque de formulario de las pantallas públicas (login, registro, etc.), directo sobre el papel. */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <Box sx={{ width: "100%", maxWidth: 420 }}>
      <Typography variant="h1" sx={{ textWrap: "balance" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: "48ch" }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 4 }}>{children}</Box>
      {footer && <Box sx={{ mt: 4, color: "text.secondary" }}>{footer}</Box>}
    </Box>
  );
}
