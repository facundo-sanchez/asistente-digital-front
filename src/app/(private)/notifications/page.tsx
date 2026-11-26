import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NotificationResponse, PageResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { UrlPagination } from "@/components/layout/UrlPagination";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { MarkAllReadButton } from "@/modules/notifications/components/MarkAllReadButton";
import { NotificationList } from "@/modules/notifications/components/NotificationList";

export const metadata: Metadata = { title: "Avisos" };

const SIZE = 20;

export default async function NotificationsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const unreadOnly = firstParam(raw.unread) === "true";
  const page = Math.max(1, Number(firstParam(raw.page)) || 1);
  const result = await serverGet<PageResponse<NotificationResponse>>(`/notifications?unread=${unreadOnly}&page=${page - 1}&size=${SIZE}`);
  const notifications = result?.content ?? [];
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <Stack spacing={4} sx={{ maxWidth: 900 }}>
      <PageHeader
        title="Avisos"
        description="Lo que vence, lo vencido, los documentos por vencer y lo que leyó la IA, de los últimos 30 días."
        action={hasUnread ? <MarkAllReadButton /> : undefined}
      />
      <Panel
        title={unreadOnly ? "Sin leer" : "Todos"}
        action={
          <TextLink href={unreadOnly ? "/notifications" : "/notifications?unread=true"}>
            {unreadOnly ? "Ver todos" : "Solo los no leídos"}
          </TextLink>
        }
      >
        {notifications.length === 0 ? (
          <Box sx={{ py: 2 }}>
            <Typography sx={{ fontWeight: 600 }}>{unreadOnly ? "Leíste todo" : "Todavía no hay avisos"}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: "60ch" }}>
              Cada mañana revisamos tus vencimientos y documentos, y te avisamos acá lo que vence pronto.
            </Typography>
          </Box>
        ) : (
          <NotificationList notifications={notifications} />
        )}
        <Box sx={{ mt: 2 }}>
          <UrlPagination page={page} totalPages={result?.totalPages ?? 0} />
        </Box>
      </Panel>
    </Stack>
  );
}
