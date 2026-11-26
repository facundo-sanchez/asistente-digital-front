"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import RequestQuoteOutlined from "@mui/icons-material/RequestQuoteOutlined";
import CreditCardOutlined from "@mui/icons-material/CreditCardOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import type { NavItem } from "./nav-item";
import { NAV_ITEMS } from "./nav-items";

const ICONS: Record<NavItem["icon"], ReactNode> = {
  dashboard: <HomeOutlined />,
  services: <ReceiptLongOutlined />,
  invoices: <RequestQuoteOutlined />,
  cards: <CreditCardOutlined />,
  obligations: <EventOutlined />,
  documents: <FolderOutlined />,
  profile: <PersonOutlined />,
};

/** Menú del riel. La sección actual se marca con el acento (fondo e icono), sin barras laterales. */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <List component="nav" aria-label="Secciones" disablePadding sx={{ display: "grid", gap: 0.5 }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <ListItemButton
            key={item.href}
            component={NextLink}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            sx={{
              borderRadius: 2,
              py: 1,
              color: active ? "rail.textActive" : "rail.text",
              bgcolor: active ? "rail.selected" : "transparent",
              "&:hover": { bgcolor: active ? "rail.selected" : "rail.hover" },
              "& .MuiListItemIcon-root": { color: active ? "secondary.main" : "inherit", minWidth: 40 },
            }}
          >
            <ListItemIcon>{ICONS[item.icon]}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: active ? 600 : 500 } } }} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
