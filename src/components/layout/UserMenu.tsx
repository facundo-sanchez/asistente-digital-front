"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Logout from "@mui/icons-material/Logout";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import type { UserResponse } from "@/types/api";
import { authApi } from "@/modules/auth/api";

/** Avatar con el menú del usuario: perfil y cerrar sesión. */
export function UserMenu({ user }: { user: Pick<UserResponse, "name" | "email"> }) {
  const router = useRouter();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const logout = async () => {
    setAnchor(null);
    await authApi.logout().catch(() => undefined);
    router.replace("/login");
    router.refresh();
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} aria-label="Menú de usuario" size="small">
        <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main", color: "primary.contrastText", fontWeight: 600, fontSize: "0.95rem" }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled sx={{ flexDirection: "column", alignItems: "flex-start", opacity: "1 !important" }}>
          <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem component={NextLink} href="/profile" onClick={() => setAnchor(null)}>
          <ListItemIcon>
            <PersonOutlined fontSize="small" />
          </ListItemIcon>
          Mi perfil
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}
