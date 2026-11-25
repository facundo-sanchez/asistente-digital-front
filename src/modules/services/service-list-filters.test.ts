import { describe, expect, it } from "vitest";
import { PAGE_SIZE, parseFilters, toListParams } from "./service-list-filters";

describe("filtros del listado de servicios", () => {
  it("sin parámetros: solo activos, página 1", () => {
    expect(parseFilters({})).toEqual({ query: "", category: undefined, status: "active", page: 1 });
  });

  it("ignora valores desconocidos en la URL", () => {
    const filters = parseFilters({ category: "NADA", status: "borrados", page: "-3" });
    expect(filters).toMatchObject({ category: undefined, status: "active", page: 1 });
  });

  it("convierte la URL a los parámetros de la API", () => {
    const filters = parseFilters({ query: " luz ", category: "ELECTRICITY", status: "inactive", page: "3" });
    expect(toListParams(filters)).toEqual({ query: "luz", category: "ELECTRICITY", active: false, page: 2, size: PAGE_SIZE });
  });

  it("el estado «todos» no filtra por activo", () => {
    expect(toListParams(parseFilters({ status: "all" })).active).toBeUndefined();
  });
});
