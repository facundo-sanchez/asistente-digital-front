import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { AuthCardProps } from "./auth-card-props";

/** Tarjeta centrada de las pantallas públicas (login, registro, etc.). */
export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <Paper variant="outlined" sx={{ width: "100%", maxWidth: 440, p: { xs: 3, sm: 4 } }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ mt: 3 }}>{children}</Box>
      {footer && (
        <Box sx={{ mt: 3, textAlign: "center", color: "text.secondary" }}>{footer}</Box>
      )}
    </Paper>
  );
}
