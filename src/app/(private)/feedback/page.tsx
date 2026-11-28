import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FeedbackResponse } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Panel } from "@/components/layout/Panel";
import { formatDay } from "@/lib/dates";
import { serverGet } from "@/lib/server/server-get";
import { FeedbackForm } from "@/modules/feedback/components/FeedbackForm";
import { FEEDBACK_KIND_LABELS } from "@/modules/feedback/feedback-kinds";

export const metadata: Metadata = { title: "Comentarios" };

export default async function FeedbackPage() {
  const sent = (await serverGet<FeedbackResponse[]>("/feedback")) ?? [];

  return (
    <Stack spacing={4} sx={{ maxWidth: 760 }}>
      <PageHeader
        title="Comentarios"
        description="Contanos qué te gustaría que haga la app, qué mejorarías o si algo no anda. Leemos todo."
      />
      <Panel title="Mandanos tu comentario">
        <FeedbackForm />
      </Panel>
      {sent.length > 0 && (
        <Panel title="Lo que nos mandaste">
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {sent.map((f) => (
              <Box component="li" key={f.id} sx={{ py: 1.75, borderBottom: 1, borderColor: "divider", "&:last-of-type": { borderBottom: 0 } }}>
                <Typography variant="body2" color="text.secondary" className="tabular-nums">
                  {FEEDBACK_KIND_LABELS[f.kind]} · {formatDay(f.createdAt)}
                  {f.page ? ` · ${f.page}` : ""}
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{f.message}</Typography>
              </Box>
            ))}
          </Box>
        </Panel>
      )}
    </Stack>
  );
}
