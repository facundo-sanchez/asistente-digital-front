"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

/** Error de una página (ej. el backend no responde). La sesión no se cierra. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 640, mx: "auto" }}>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => reset()}>
            Reintentar
          </Button>
        }
      >
        No pudimos cargar esta pantalla. Puede que el servicio no esté disponible en este momento.
      </Alert>
    </Box>
  );
}
