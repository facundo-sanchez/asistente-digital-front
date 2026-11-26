"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { withBasePath } from "@/lib/config";

const FROM_OPTIONS = [
  { value: "new", label: "Solo los correos que lleguen desde ahora" },
  { value: "3", label: "Los últimos 3 meses" },
  { value: "6", label: "Los últimos 6 meses" },
  { value: "12", label: "El último año" },
];

/** Antes de ir a Google: qué se lee, qué no, y desde cuándo importar. */
export function ConnectGmail({ reconnect = false }: { reconnect?: boolean }) {
  const [from, setFrom] = useState("3");

  return (
    <Box sx={{ display: "grid", gap: 2.5 }}>
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: "grid", gap: 1, color: "text.secondary" }}>
        <Typography component="li" variant="body2">
          Solo leemos los correos de tus proveedores (Camuzzi, Edenor, tu banco…). El resto de tu correo ni se descarga.
        </Typography>
        <Typography component="li" variant="body2">
          Es solo lectura: no enviamos, borramos ni modificamos nada.
        </Typography>
        <Typography component="li" variant="body2">
          Las facturas y resúmenes que encontremos se leen con IA y te esperan en «Para revisar»: nada se registra sin que lo confirmes.
        </Typography>
        <Typography component="li" variant="body2">
          Podés desconectarlo cuando quieras; lo que ya se importó queda.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        {!reconnect && (
          <TextField select size="small" label="Importar" value={from} onChange={(e) => setFrom(e.target.value)} sx={{ minWidth: 280 }}>
            {FROM_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
        )}
        {/* Navegación completa (no NextLink): la ruta del BFF redirige a Google */}
        <Button variant="contained" href={withBasePath(`/api/integrations/gmail?from=${reconnect ? "new" : from}`)}>
          {reconnect ? "Volver a conectar Gmail" : "Conectar Gmail"}
        </Button>
      </Box>
    </Box>
  );
}
