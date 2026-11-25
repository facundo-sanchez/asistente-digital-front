"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { GuillocheRosette } from "@/components/brand/GuillocheRosette";
import { HOME_PATH } from "@/lib/config";

export default function NotFound() {
  return (
    <Box component="main" sx={{ minHeight: "100vh", width: "100%", display: "grid", placeItems: "center", p: 3, textAlign: "center" }}>
      <Box sx={{ display: "grid", justifyItems: "center", gap: 2.5 }}>
        <GuillocheRosette value={null} size={140} />
        <Typography variant="h1">No encontramos esta página</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: "42ch" }}>
          Puede que el enlace esté mal escrito o que la página ya no exista.
        </Typography>
        <Button component={Link} href={HOME_PATH} variant="contained" size="large">
          Ir al inicio
        </Button>
      </Box>
    </Box>
  );
}
