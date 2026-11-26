import { describe, expect, it } from "vitest";
import { PAGE_SIZE, hasActiveFilters, parseFilters, toListParams } from "./obligation-list-filters";

describe("filtros del listado de vencimientos", () => {
  it("sin parámetros: lo que falta pagar, página 1", () => {
    const filters = parseFilters({});
    expect(filters).toEqual({ query: "", status: "open", serviceId: undefined, category: undefined, from: undefined, to: undefined, page: 1 });
    expect(toListParams(filters).status).toBe("PENDING,PARTIALLY_PAID,DUE_SOON,OVERDUE");
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("ignora valores desconocidos", () => {
    expect(parseFilters({ status: "NADA", category: "X", serviceId: "no", from: "15/12/2026", page: "-1" })).toMatchObject({
      status: "open",
      category: undefined,
      serviceId: undefined,
      from: undefined,
      page: 1,
    });
  });

  it("convierte la URL a los parámetros de la API", () => {
    const filters = parseFilters({ query: " vtv ", status: "all", category: "ELECTRICITY", from: "2026-12-01", to: "2026-12-31", page: "3" });
    expect(toListParams(filters)).toEqual({
      query: "vtv",
      status: undefined,
      serviceId: undefined,
      category: "ELECTRICITY",
      from: "2026-12-01",
      to: "2026-12-31",
      page: 2,
      size: PAGE_SIZE,
    });
    expect(hasActiveFilters(filters)).toBe(true);
  });
});
