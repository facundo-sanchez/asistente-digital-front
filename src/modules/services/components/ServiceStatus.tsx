import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** Estado activo / inactivo con palabra y punto (el color nunca va solo). feminine: para tarjetas. */
export function ServiceStatus({ active, feminine = false }: { active: boolean; feminine?: boolean }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap" }}>
      <Box
        component="span"
        aria-hidden
        sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: active ? "success.main" : "text.disabled" }}
      />
      <Typography component="span" variant="body2" color={active ? "text.primary" : "text.secondary"}>
        {active ? (feminine ? "Activa" : "Activo") : feminine ? "Dada de baja" : "Inactivo"}
      </Typography>
    </Box>
  );
}
