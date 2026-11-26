import { describe, expect, it } from "vitest";
import { PAGE_SIZE, hasActiveFilters, parseFilters, toListParams } from "./invoice-list-filters";

describe("filtros del listado de facturas", () => {
  it("sin parámetros: confirmadas, página 1", () => {
    const filters = parseFilters({});
    expect(filters).toEqual({ query: "", serviceId: undefined, from: undefined, to: undefined, page: 1 });
    expect(toListParams(filters)).toMatchObject({ status: "CONFIRMED", page: 0, size: PAGE_SIZE });
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("ignora valores desconocidos y convierte la página", () => {
    const filters = parseFilters({ query: " 0001 ", serviceId: "no", from: "1/12/2026", to: "2026-12-31", page: "3" });
    expect(filters).toMatchObject({ query: "0001", serviceId: undefined, from: undefined, to: "2026-12-31", page: 3 });
    expect(toListParams(filters)).toMatchObject({ query: "0001", to: "2026-12-31", page: 2 });
    expect(hasActiveFilters(filters)).toBe(true);
  });
});
