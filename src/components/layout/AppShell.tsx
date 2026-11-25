"use client";

import { useState, type ReactNode } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import type { UserResponse } from "@/types/api";
import { NavList } from "./NavList";
import { UserMenu } from "./UserMenu";

const DRAWER_WIDTH = 248;

/**
 * Estructura del área privada: barra superior, menú lateral (fijo en escritorio,
 * desplegable en mobile) y contenido.
 */
export function AppShell({ user, children }: { user: Pick<UserResponse, "name" | "email">; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawer = (
    <>
      <Toolbar>
        <Typography variant="subtitle1" color="primary" noWrap sx={{ fontWeight: 800 }}>
          Asistente Digital
        </Typography>
      </Toolbar>
      <NavList onNavigate={() => setMobileOpen(false)} />
    </>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 1, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <UserMenu user={user} />
        </Toolbar>
      </AppBar>

      <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: DRAWER_WIDTH } }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
