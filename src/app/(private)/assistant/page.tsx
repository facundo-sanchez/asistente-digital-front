import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import ArrowBackOutlined from "@mui/icons-material/ArrowBackOutlined";
import type { ConversationDetailResponse, ConversationResponse } from "@/types/api";
import { TextLink } from "@/components/common/TextLink";
import { PageHeader } from "@/components/layout/PageHeader";
import { firstParam, type SearchParams } from "@/lib/search-params";
import { serverGet } from "@/lib/server/server-get";
import { isUuid } from "@/lib/uuid";
import { AssistantChat } from "@/modules/assistant/components/AssistantChat";
import { ConversationList } from "@/modules/assistant/components/ConversationList";

export const metadata: Metadata = { title: "Asistente" };

/** Asistente IA (CU-008): conversaciones a la izquierda y el chat a la derecha; en el celular, una cosa por vez. */
export default async function AssistantPage({ searchParams }: { searchParams: SearchParams }) {
  const selected = firstParam((await searchParams).c) ?? null;
  if (selected && !isUuid(selected)) notFound();
  const [conversations, detail] = await Promise.all([
    serverGet<ConversationResponse[]>("/assistant/conversations"),
    selected ? serverGet<ConversationDetailResponse>(`/assistant/conversations/${selected}`) : null,
  ]);
  if (selected && !detail) notFound();
  // En el celular: sin conversación elegida se ve la lista; con una elegida, el chat
  const chatOnMobile = selected !== null;

  return (
    <Stack spacing={3} sx={{ maxWidth: 1100 }}>
      <PageHeader title="Asistente" description="Preguntá por tus vencimientos, facturas, gastos y documentos." />
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "260px minmax(0, 1fr)" }, alignItems: "start" }}>
        <Box sx={{ display: { xs: chatOnMobile ? "none" : "block", md: "block" }, position: { md: "sticky" }, top: { md: 88 } }}>
          <ConversationList conversations={conversations ?? []} selectedId={selected} />
        </Box>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, minWidth: 0, display: { xs: chatOnMobile ? "block" : "none", md: "block" } }}>
          {chatOnMobile && (
            <TextLink
              href="/assistant"
              sx={{ display: { xs: "inline-flex", md: "none" }, alignItems: "center", gap: 0.5, mb: 2, color: "text.secondary" }}
            >
              <ArrowBackOutlined fontSize="small" />
              Conversaciones
            </TextLink>
          )}
          <AssistantChat key={selected ?? "new"} conversationId={selected} initial={detail?.messages ?? []} />
        </Paper>
      </Box>
    </Stack>
  );
}
