import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** Estado del servicio con palabra y punto (el color nunca va solo). */
export function ServiceStatus({ active }: { active: boolean }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, whiteSpace: "nowrap" }}>
      <Box
        component="span"
        aria-hidden
        sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: active ? "success.main" : "text.disabled" }}
      />
      <Typography component="span" variant="body2" color={active ? "text.primary" : "text.secondary"}>
        {active ? "Activo" : "Inactivo"}
      </Typography>
    </Box>
  );
}
