"use client";

import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import type { NotificationResponse } from "@/types/api";
import { formatDay } from "@/lib/dates";
import { notificationsApi } from "../api";
import { notificationHref } from "../notification-href";

/** Los avisos como lista; al tocar uno queda leído y lleva a lo que avisa. */
export function NotificationList({ notifications }: { notifications: NotificationResponse[] }) {
  const router = useRouter();

  const go = async (notification: NotificationResponse) => {
    if (!notification.read) await notificationsApi.markRead(notification.id).catch(() => undefined);
    router.push(notificationHref(notification));
  };

  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {notifications.map((n) => (
        <Box component="li" key={n.id} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <ButtonBase
            onClick={() => go(n)}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              py: 1.75,
              px: 1,
              textAlign: "left",
              borderRadius: 1,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Box
              component="span"
              aria-hidden
              sx={{ mt: 0.9, width: 8, height: 8, flexShrink: 0, borderRadius: "50%", bgcolor: n.read ? "transparent" : "error.main" }}
            />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: n.read ? 400 : 600 }}>
                {n.title}
                {!n.read && (
                  <Typography component="span" variant="body2" color="error.main">
                    {" · sin leer"}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {n.message}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" className="tabular-nums" sx={{ whiteSpace: "nowrap" }}>
              {formatDay(n.createdAt)}
            </Typography>
          </ButtonBase>
        </Box>
      ))}
    </Box>
  );
}
