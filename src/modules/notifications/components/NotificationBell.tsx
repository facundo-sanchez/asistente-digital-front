"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import type { NotificationResponse } from "@/types/api";
import { visuallyHidden } from "@/components/ledger/ledger-styles";
import { formatDay } from "@/lib/dates";
import { notificationsApi } from "../api";
import { notificationHref } from "../notification-href";

const LATEST = 6;

/** Campana de la barra: cuántos avisos sin leer hay (se actualiza al navegar) y los últimos al abrirla. */
export function NotificationBell() {
  const router = useRouter();
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [latest, setLatest] = useState<NotificationResponse[] | null>(null);

  useEffect(() => {
    notificationsApi
      .unreadCount()
      .then((r) => setUnread(r.unread))
      .catch(() => undefined);
  }, [pathname]);

  const open = (target: HTMLElement) => {
    setAnchor(target);
    notificationsApi
      .latest(LATEST)
      .then((page) => setLatest(page.content))
      .catch(() => setLatest([]));
  };

  const go = async (notification: NotificationResponse) => {
    setAnchor(null);
    if (!notification.read) {
      setUnread((n) => Math.max(0, n - 1));
      await notificationsApi.markRead(notification.id).catch(() => undefined);
    }
    router.push(notificationHref(notification));
  };

  const readAll = async () => {
    await notificationsApi.markAllRead().catch(() => undefined);
    setUnread(0);
    setLatest((current) => current?.map((n) => ({ ...n, read: true })) ?? null);
  };

  const label = unread === 0 ? "Avisos" : `Avisos, ${unread} sin leer`;

  return (
    <>
      <IconButton onClick={(e) => open(e.currentTarget)} aria-label={label} size="small">
        <Badge badgeContent={unread} color="error" max={99}>
          <NotificationsOutlined />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxWidth: "calc(100vw - 32px)" } } }}
      >
        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Typography sx={{ fontWeight: 700 }}>Avisos</Typography>
          {unread > 0 && (
            <Button size="small" onClick={readAll}>
              Marcar todo como leído
            </Button>
          )}
        </Box>
        <Divider />
        {latest === null && <MenuItem disabled>Cargando…</MenuItem>}
        {latest?.length === 0 && (
          <MenuItem disabled sx={{ whiteSpace: "normal" }}>
            No tenés avisos. Te avisamos acá cuando algo esté por vencer.
          </MenuItem>
        )}
        {latest?.map((n) => (
          <MenuItem key={n.id} onClick={() => go(n)} sx={{ alignItems: "flex-start", gap: 1.5, whiteSpace: "normal", py: 1.25 }}>
            <Box
              component="span"
              aria-hidden
              sx={{ mt: 0.9, width: 8, height: 8, flexShrink: 0, borderRadius: "50%", bgcolor: n.read ? "transparent" : "error.main" }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: n.read ? 400 : 600 }}>
                {n.title}
                {!n.read && (
                  <Box component="span" sx={visuallyHidden}>
                    {" "}
                    (sin leer)
                  </Box>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" className="tabular-nums">
                {formatDay(n.createdAt)}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          component={NextLink}
          href="/notifications"
          onClick={() => setAnchor(null)}
          sx={{ justifyContent: "center", color: "primary.main" }}
        >
          Ver todos los avisos
        </MenuItem>
      </Menu>
    </>
  );
}
