"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import type { NavItem } from "./nav-item";
import { NAV_ITEMS } from "./nav-items";

const ICONS: Record<NavItem["icon"], React.ReactNode> = {
  dashboard: <DashboardOutlined />,
  profile: <PersonOutlined />,
};

/** Menú de navegación del área privada. Resalta la sección actual. */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <List component="nav" aria-label="Secciones">
      {NAV_ITEMS.map((item) => (
        <ListItemButton
          key={item.href}
          component={NextLink}
          href={item.href}
          selected={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          onClick={onNavigate}
          sx={{ mx: 1, borderRadius: 2 }}
        >
          <ListItemIcon>{ICONS[item.icon]}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}
