"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import SendRounded from "@mui/icons-material/SendRounded";
import StopRounded from "@mui/icons-material/StopRounded";
import type { MessageResponse } from "@/types/api";
import { ApiError } from "@/lib/api/api-error";
import { assistantApi, streamAnswer } from "../api";
import { toolStatus } from "../tool-status";
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
  /** Texto que va llegando y qué está consultando, mientras responde. */
  const [partial, setPartial] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** La pregunta que falló, para reintentarla. */
  const [failed, setFailed] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [messages, thinking, partial]);

  /** retry: la pregunta ya está en pantalla (y guardada); el backend no la repite. */
  const send = async (content: string, retry = false) => {
    const question = content.trim();
    if (!question || thinking) return;
    setError(null);
    setFailed(null);
    setText("");
    setThinking(true);
    setPartial("");
    setStatus(null);
    if (!retry) {
      setMessages((current) => [
        ...current,
        { id: `local-${Date.now()}`, role: "USER", content: question, metadata: {}, createdAt: new Date().toISOString() },
      ]);
    }
    const controller = new AbortController();
    abort.current = controller;
    let answered = false;
    try {
      const id = conversationId ?? (await assistantApi.create()).id;
      setConversationId(id);
      await streamAnswer(
        id,
        question,
        (event) => {
          if (event.type === "tool") setStatus(toolStatus(event.text));
          if (event.type === "text") setPartial((current) => current + (event.text ?? ""));
          if (event.type === "error") throw new Error(event.text ?? "");
          if (event.type === "done" && event.message) {
            answered = true;
            const message = event.message;
            setMessages((current) => [...current, message]);
          }
        },
        controller.signal,
      );
      if (!answered) throw new Error("");
      if (!stay && !conversationId) router.replace(`/assistant?c=${id}`);
      else if (!stay) router.refresh();
    } catch (e) {
      if (controller.signal.aborted) return;
      const known = (e instanceof ApiError && e.status < 500) || (e instanceof Error && !(e instanceof ApiError) && e.message);
      setError(known ? (e as Error).message : "No pude responder ahora, probá de nuevo en un rato.");
      // Con el límite por hora no tiene sentido reintentar ya
      if (!(e instanceof ApiError && e.status === 429)) setFailed(question);
    } finally {
      setThinking(false);
      setPartial("");
      setStatus(null);
      abort.current = null;
    }
  };

  // Detener deja de mostrar la respuesta; el servidor la termina y queda en la conversación
  const stop = () => abort.current?.abort();

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
        {thinking && partial && (
          <ChatMessage
            message={{ id: "partial", role: "ASSISTANT", content: partial, metadata: {}, createdAt: "" }}
            streaming
          />
        )}
        {thinking && !partial && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <ThinkingDots />
            {status && (
              <Typography variant="body2" color="text.secondary" aria-live="polite">
                {status}
              </Typography>
            )}
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            action={
              failed && (
                <Button color="inherit" size="small" onClick={() => send(failed, true)}>
                  Reintentar
                </Button>
              )
            }
          >
            {error}
          </Alert>
        )}
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
          {thinking ? (
            <IconButton aria-label="Detener la respuesta" onClick={stop} sx={{ mb: 0.5 }}>
              <StopRounded />
            </IconButton>
          ) : (
            <IconButton type="submit" color="primary" aria-label="Enviar" disabled={!text.trim()} sx={{ mb: 0.5 }}>
              <SendRounded />
            </IconButton>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
          Las respuestas salen de tus datos, pero pueden tener errores: revisá los links.
        </Typography>
      </Box>
    </Box>
  );
}
