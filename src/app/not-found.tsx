"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { HOME_PATH } from "@/lib/config";

export default function NotFound() {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3, textAlign: "center" }}>
      <Box>
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          La página que buscás no existe.
        </Typography>
        <Button component={Link} href={HOME_PATH} variant="contained">
          Ir al inicio
        </Button>
      </Box>
    </Box>
  );
}
