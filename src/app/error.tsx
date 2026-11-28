"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { BrandMark } from "@/components/brand/BrandMark";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { ButtonLink } from "@/components/common/ButtonLink";
import { ReportErrorButton } from "@/modules/feedback/components/ReportErrorButton";

/**
 * Error de una página (casi siempre: el backend no responde). La sesión no se cierra.
 * Pantalla tranquila sobre el papel: la roseta sin anillo, qué pasó, que los datos están
 * a salvo y cómo seguir. Reintentar vuelve a pedir los datos al servidor.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    startTransition(() => {
      router.refresh();
      reset();
      setRetrying(false);
    });
  };

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default", px: { xs: 2, sm: 5 }, py: { xs: 2, sm: 3 } }}
    >
      <BrandMark />
      <Box
        sx={{
          flex: 1,
          display: "grid",
          alignItems: "center",
          justifyItems: { xs: "start", md: "stretch" },
          gap: { xs: 4, md: 8 },
          gridTemplateColumns: { xs: "1fr", md: "auto minmax(0, 480px)" },
          justifyContent: "center",
          py: { xs: 4, md: 8 },
        }}
      >
        <Box sx={{ opacity: 0.55, display: { xs: "none", sm: "block" } }}>
          <GuillocheRosette value={null} size={240} lineColor="var(--mui-palette-text-disabled)" />
        </Box>
        <Box role="alert" sx={{ display: "grid", gap: 2.5, maxWidth: "52ch" }}>
          <Typography component="h1" sx={{ fontSize: { xs: "1.75rem", md: "2.125rem" }, fontWeight: 600, lineHeight: 1.2, textWrap: "balance" }}>
            No pudimos conectarnos con el servidor
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.6 }}>
            Tus datos están a salvo y tu sesión sigue abierta. Suele resolverse en unos minutos: probá de nuevo en un rato.
          </Typography>
          <Box
            component="dl"
            sx={{
              m: 0,
              py: 1.5,
              borderBlock: 1,
              borderColor: "divider",
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: 3,
              rowGap: 0.75,
              "& dt": {
                fontFamily: "var(--font-archivo-narrow)",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "text.secondary",
              },
              "& dd": { m: 0 },
            }}
          >
            <dt>Estado</dt>
            <dd>Sin respuesta del servicio</dd>
            <dt>Qué podés hacer</dt>
            <dd>Reintentar, volver al inicio o reportarnos el error</dd>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, pt: 0.5 }}>
            <Button variant="contained" onClick={retry} loading={retrying}>
              Reintentar
            </Button>
            <ButtonLink href="/dashboard" variant="text" color="inherit">
              Ir al inicio
            </ButtonLink>
            <ReportErrorButton error={error} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
