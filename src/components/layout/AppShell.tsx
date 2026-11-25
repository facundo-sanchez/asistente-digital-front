"use client";

import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import type { UserResponse } from "@/types/api";
import { BrandMark } from "@/components/brand/BrandMark";
import { ColorModeToggle } from "@/components/theme/ColorModeToggle";
import { NavList } from "./NavList";
import { UserMenu } from "./UserMenu";

const RAIL_WIDTH = 248;

/**
 * Estructura del área privada: riel lateral en tinta (fijo en escritorio, desplegable
 * en mobile), barra superior con el modo claro/oscuro y el usuario, y contenido.
 */
export function AppShell({ user, children }: { user: Pick<UserResponse, "name" | "email">; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const rail = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", px: 2, py: 3, gap: 4 }}>
      <Box sx={{ px: 1 }}>
        <BrandMark tone="rail" />
      </Box>
      <NavList onNavigate={() => setMobileOpen(false)} />
    </Box>
  );

  const railPaper = {
    width: RAIL_WIDTH,
    border: 0,
    bgcolor: "rail.background",
    color: "rail.text",
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Box component="aside" aria-label="Menú principal" sx={{ width: { md: RAIL_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": railPaper }}
        >
          {rail}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": railPaper }}
        >
          {rail}
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: { xs: 2, md: 5 },
            height: 64,
            bgcolor: "background.default",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <IconButton
            edge="start"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" }, color: "text.primary" }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { md: "none" } }}>
            <BrandMark />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <ColorModeToggle />
          <UserMenu user={user} />
        </Box>

        <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, md: 5 }, py: { xs: 3, md: 5 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
