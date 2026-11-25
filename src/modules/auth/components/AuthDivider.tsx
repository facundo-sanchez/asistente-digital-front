import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

/** Separador "o" entre el formulario y el login con Google. */
export function AuthDivider() {
  return (
    <Divider sx={{ my: 3 }}>
      <Typography variant="body2" color="text.secondary">
        o
      </Typography>
    </Divider>
  );
}
