"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SendRounded from "@mui/icons-material/SendRounded";
import type { MessageResponse } from "@/types/api";
import { ApiError } from "@/lib/api/api-error";
import { assistantApi } from "../api";
import { ChatMessage } from "./ChatMessage";
import { ThinkingDots } from "./ThinkingDots";

const SUGGESTIONS = [
  "¿Qué vence esta semana?",
  "¿Cuánto tengo que pagar este mes?",
  "¿Qué facturas no pagué?",
  "¿Cuánto gasté con la tarjeta este mes?",
];

/**
 * El chat de una conversación. Sin conversationId, la crea con la primera pregunta.
 * stay: sigue en la misma pantalla (la burbuja del celular) en vez de ir a /assistant?c=…
 */
export function AssistantChat({
  conversationId: initialId,
  initial,
  stay = false,
}: {
  conversationId: string | null;
  initial: MessageResponse[];
  stay?: boolean;
}) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState(initialId);
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages, thinking]);

  const send = async (content: string) => {
    const question = content.trim();
    if (!question || thinking) return;
    setError(null);
    setText("");
    setThinking(true);
    setMessages((current) => [
      ...current,
      { id: `local-${Date.now()}`, role: "USER", content: question, metadata: {}, createdAt: new Date().toISOString() },
    ]);
    try {
      const id = conversationId ?? (await assistantApi.create()).id;
      setConversationId(id);
      const answer = await assistantApi.send(id, question);
      setMessages((current) => [...current, answer]);
      if (!stay && !conversationId) router.replace(`/assistant?c=${id}`);
      else if (!stay) router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.status < 500 ? e.message : "No pude responder ahora, probá de nuevo en un rato.");
      setText(question);
    } finally {
      setThinking(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        // En la burbuja ocupa el panel: los mensajes se desplazan y la caja queda abajo
        ...(stay ? { height: "100%" } : { minHeight: { xs: "calc(100dvh - 220px)", md: 560 } }),
      }}
    >
      <Stack spacing={2.5} sx={{ flexGrow: 1, pb: 2, ...(stay && { minHeight: 0, overflowY: "auto", px: 2, pt: 2 }) }}>
        {messages.length === 0 && (
          <Box sx={{ my: "auto", py: 4 }}>
            <Typography variant="h2" sx={{ fontSize: "1.25rem", mb: 0.5 }}>
              ¿Qué querés saber de tus cuentas?
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Respondo con tus vencimientos, facturas, servicios, tarjetas y documentos.
            </Typography>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              {SUGGESTIONS.map((suggestion) => (
                <ButtonBase
                  key={suggestion}
                  onClick={() => send(suggestion)}
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    typography: "body2",
                    transition: "border-color 150ms, background-color 150ms",
                    "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
                  }}
                >
                  {suggestion}
                </ButtonBase>
              ))}
            </Box>
          </Box>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {thinking && <ThinkingDots />}
        {error && <Alert severity="error">{error}</Alert>}
        <div ref={end} />
      </Stack>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        sx={{
          position: "sticky",
          bottom: 0,
          pt: 1.5,
          pb: stay ? 1.5 : "calc(env(safe-area-inset-bottom, 0px) + 4px)",
          bgcolor: "inherit",
          ...(stay && { px: 2, borderTop: 1, borderColor: "divider" }),
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(text);
              }
            }}
            placeholder="Preguntá por tus vencimientos, gastos o documentos…"
            slotProps={{ htmlInput: { maxLength: 4000, "aria-label": "Tu consulta" } }}
          />
          <IconButton type="submit" color="primary" aria-label="Enviar" disabled={!text.trim() || thinking} sx={{ mb: 0.5 }}>
            <SendRounded />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
          Las respuestas salen de tus datos, pero pueden tener errores: revisá los links.
        </Typography>
      </Box>
    </Box>
  );
}
