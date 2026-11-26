import { describe, expect, it } from "vitest";
import { answerBlocks, boldParts } from "./answer-blocks";
import { readReferences, referenceHref } from "./references";

describe("respuesta del asistente", () => {
  it("arma párrafos y listas", () => {
    expect(answerBlocks("Esta semana vencen 2:\n\n* Gas, $ 1.000\n- Luz\nNada más.")).toEqual([
      { kind: "text", text: "Esta semana vencen 2:" },
      { kind: "list", items: ["Gas, $ 1.000", "Luz"] },
      { kind: "text", text: "Nada más." },
    ]);
  });

  it("marca la negrita", () => {
    expect(boldParts("Total **$ 5.000** este mes")).toEqual([
      { text: "Total ", bold: false },
      { text: "$ 5.000", bold: true },
      { text: " este mes", bold: false },
    ]);
  });

  it("lee las referencias válidas y arma su link", () => {
    const refs = readReferences({ references: [{ type: "INVOICE", id: "a1", label: "Gas" }, { type: "OTRA", id: "x" }, "basura"] });

    expect(refs).toHaveLength(1);
    expect(referenceHref(refs[0])).toBe("/invoices/a1");
    expect(readReferences({})).toEqual([]);
  });
});
