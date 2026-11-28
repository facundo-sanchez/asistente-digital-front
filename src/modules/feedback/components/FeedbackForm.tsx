"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { FeedbackKind } from "@/types/api";
import { ApiError } from "@/lib/api/api-error";
import { feedbackApi } from "../api";
import { FEEDBACK_KIND_LABELS } from "../feedback-kinds";

const KINDS: FeedbackKind[] = ["SUGGESTION", "COMMENT", "PROBLEM"];
const MAX = 2000;

/** Mandar una sugerencia, un comentario o contar algo que no anda. */
export function FeedbackForm() {
  const router = useRouter();
  const [kind, setKind] = useState<FeedbackKind>("SUGGESTION");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Escribí tu comentario.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      await feedbackApi.send({ kind, message: message.trim() });
      setMessage("");
      setSent(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError && e.data?.mensaje ? e.data.mensaje : "No pudimos mandarlo. Probá de nuevo.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box component="form" onSubmit={send} noValidate sx={{ display: "grid", gap: 2.5 }}>
      <ToggleButtonGroup
        exclusive
        value={kind}
        onChange={(_, value: FeedbackKind | null) => value && setKind(value)}
        aria-label="Qué querés mandar"
        size="small"
        sx={{ flexWrap: "wrap" }}
      >
        {KINDS.map((k) => (
          <ToggleButton key={k} value={k}>
            {FEEDBACK_KIND_LABELS[k]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <TextField
        label={kind === "PROBLEM" ? "¿Qué pasó y en qué pantalla?" : "Tu mensaje"}
        multiline
        minRows={4}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value.slice(0, MAX));
          setSent(false);
        }}
        helperText={`${message.length}/${MAX}`}
        error={Boolean(error)}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {sent && <Alert severity="success">¡Gracias! Lo recibimos y lo vamos a leer.</Alert>}
      <Box>
        <Button type="submit" variant="contained" loading={sending}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
}
