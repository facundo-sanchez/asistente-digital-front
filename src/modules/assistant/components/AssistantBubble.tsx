"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import { AssistantChat } from "./AssistantChat";

/**
 * En el celular: burbuja flotante en toda la app que abre el asistente a pantalla completa,
 * sin salir de donde estás. En escritorio no se muestra (está en el menú).
 */
export function AssistantBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Cada apertura empieza una consulta nueva
  const [session, setSession] = useState(0);

  if (pathname.startsWith("/assistant")) return null;

  return (
    <>
      <Fab
        color="primary"
        aria-label="Abrir el asistente"
        data-noprint
        onClick={() => {
          setSession((n) => n + 1);
          setOpen(true);
        }}
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          right: 16,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          zIndex: (theme) => theme.zIndex.speedDial,
        }}
      >
        <ForumOutlined />
      </Fab>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)} aria-labelledby="assistant-bubble-title">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            pt: "calc(env(safe-area-inset-top, 0px) + 8px)",
            pb: 1,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography id="assistant-bubble-title" variant="h2" sx={{ fontSize: "1.125rem", flexGrow: 1 }}>
            Asistente
          </Typography>
          <Typography component={NextLink} href="/assistant" variant="body2" onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}>
            Mis consultas
          </Typography>
          <IconButton aria-label="Cerrar el asistente" onClick={() => setOpen(false)}>
            <CloseOutlined />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto", px: 2, pt: 2, display: "flex", flexDirection: "column" }}>
          <AssistantChat key={session} conversationId={null} initial={[]} stay />
        </Box>
      </Dialog>
    </>
  );
}
