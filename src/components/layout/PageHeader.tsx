import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { PageHeaderProps } from "./page-header-props";

/** Título de página (h1) con su línea de contexto y, opcionalmente, la acción principal. */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 2 }}>
      <Box>
        <Typography variant="h1">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
