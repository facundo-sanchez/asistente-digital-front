"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Grow from "@mui/material/Grow";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ForumOutlined from "@mui/icons-material/ForumOutlined";
import { AssistantChat } from "./AssistantChat";

/**
 * En el celular: burbuja flotante en toda la app. Abre el chat en un panel sobre la página,
 * sin salir de ella; la conversación sigue ahí al cerrarlo y volverlo a abrir.
 * En escritorio no se muestra (el asistente está en el menú).
 */
export function AssistantBubble() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Cambia con "Nueva consulta" para empezar el chat de cero
  const [session, setSession] = useState(0);

  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  if (pathname.startsWith("/assistant")) return null;

  return (
    <Box data-noprint sx={{ display: { xs: "block", md: "none" } }}>
      <Grow in={open} style={{ transformOrigin: "bottom right" }} timeout={180} unmountOnExit={false}>
        <Paper
          role="dialog"
          aria-label="Asistente"
          elevation={8}
          sx={{
            position: "fixed",
            left: 12,
            right: 12,
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
            height: "min(70dvh, 600px)",
            zIndex: (theme) => theme.zIndex.modal,
            display: open ? "flex" : "none",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, pl: 2, pr: 0.5, py: 0.5, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h2" sx={{ fontSize: "1rem", flexGrow: 1 }}>
              Asistente
            </Typography>
            <Typography
              component="button"
              type="button"
              variant="body2"
              onClick={() => setSession((n) => n + 1)}
              sx={{ border: 0, bgcolor: "transparent", color: "text.secondary", cursor: "pointer", px: 1, py: 1, font: "inherit" }}
            >
              Nueva
            </Typography>
            <Typography component={NextLink} href="/assistant" variant="body2" onClick={() => setOpen(false)} sx={{ color: "text.secondary", px: 1, py: 1 }}>
              Mis consultas
            </Typography>
            <IconButton aria-label="Cerrar el asistente" onClick={() => setOpen(false)}>
              <CloseOutlined />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <AssistantChat key={session} conversationId={null} initial={[]} stay />
          </Box>
        </Paper>
      </Grow>
      <Fab
        color="primary"
        aria-label={open ? "Cerrar el asistente" : "Abrir el asistente"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        sx={{
          position: "fixed",
          right: 16,
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
          zIndex: (theme) => theme.zIndex.modal,
        }}
      >
        {open ? <CloseOutlined /> : <ForumOutlined />}
      </Fab>
    </Box>
  );
}
