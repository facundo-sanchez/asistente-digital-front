import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { PanelProps } from "./panel-props";

/** Sección de una página: papel con filete, título (h2) y contenido. No se anidan. */
export function Panel({ title, description, action, children }: PanelProps) {
  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
        <Box>
          <Typography variant="h2" sx={{ fontSize: "1.125rem" }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Paper>
  );
}
