import type { AssistantStreamEvent } from "@/types/api";

/**
 * Separa los eventos SSE completos del texto recibido. Devuelve los eventos y lo que sobra
 * (un evento a medias), que se junta con lo próximo que llegue.
 */
export function parseSse(buffer: string): { events: AssistantStreamEvent[]; rest: string } {
  const parts = buffer.replace(/\r\n/g, "\n").split("\n\n");
  const rest = parts.pop() ?? "";
  const events: AssistantStreamEvent[] = [];
  for (const part of parts) {
    const data = part
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
      .join("\n");
    if (!data) continue;
    try {
      events.push(JSON.parse(data) as AssistantStreamEvent);
    } catch {
      // Un evento roto no corta la respuesta
    }
  }
  return { events, rest };
}
