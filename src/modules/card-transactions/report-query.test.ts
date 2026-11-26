import { describe, expect, it } from "vitest";
import { backendParams, detailHref, readReportQuery } from "./report-query";

describe("filtros del informe", () => {
  it("toma solo valores válidos de la URL", () => {
    const query = readReportQuery({ from: "2026-06", to: "junio", cardId: "x", category: "FUEL", merchant: "  YPF ", page: "-3" });

    expect(query).toEqual({ from: "2026-06", to: null, cardId: null, category: "FUEL", merchant: "YPF", page: 1 });
  });

  it("al backend le manda el primer día de cada mes", () => {
    const params = backendParams(readReportQuery({ from: "2026-06", to: "2026-11" }));

    expect(params.toString()).toBe("from=2026-06-01&to=2026-11-01");
  });

  it("el detalle conserva el período y suma el rubro", () => {
    expect(detailHref(readReportQuery({ from: "2026-06", to: "2026-11" }), { category: "FUEL" })).toBe(
      "/cards/transactions?from=2026-06&to=2026-11&category=FUEL",
    );
  });
});
