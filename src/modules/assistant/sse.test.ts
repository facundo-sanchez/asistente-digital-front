import { describe, expect, it } from "vitest";
import { parseSse } from "./sse";

describe("eventos SSE del asistente", () => {
  it("devuelve los eventos completos y guarda el que llegó a medias", () => {
    const { events, rest } = parseSse('data:{"type":"tool","text":"unpaidInvoices","message":null}\n\ndata:{"type":"text","text":"Ten');

    expect(events).toEqual([{ type: "tool", text: "unpaidInvoices", message: null }]);
    expect(parseSse(rest + 'és","message":null}\n\n').events[0].text).toBe("Tenés");
  });

  it("ignora comentarios y eventos rotos", () => {
    expect(parseSse(": ping\n\ndata: {roto\n\n").events).toEqual([]);
  });
});
