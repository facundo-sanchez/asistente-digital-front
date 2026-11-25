import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import { HOME_PATH, withBasePath } from "@/lib/config";
import type { GoogleLoginButtonProps } from "./google-login-button-props";

/**
 * Enlace al inicio del login con Google en el BFF. Es navegación completa (no fetch):
 * el navegador tiene que ir a Google y volver.
 */
export function GoogleLoginButton({ next = HOME_PATH, label = "Continuar con Google" }: GoogleLoginButtonProps) {
  const href = withBasePath(`/api/auth/google?next=${encodeURIComponent(next)}`);
  return (
    <Button component="a" href={href} variant="outlined" size="large" fullWidth startIcon={<GoogleIcon />}>
      {label}
    </Button>
  );
}
