import { describe, expect, it } from "vitest";
import { PAGE_SIZE, parseFilters, toListParams } from "./document-list-filters";

describe("filtros del listado de documentos", () => {
  it("sin parámetros: sin filtros, página 1", () => {
    expect(parseFilters({})).toEqual({ query: "", documentType: undefined, serviceId: undefined, page: 1 });
  });

  it("ignora valores desconocidos", () => {
    expect(parseFilters({ documentType: "NADA", serviceId: "no-es-uuid", page: "0" })).toMatchObject({
      documentType: undefined,
      serviceId: undefined,
      page: 1,
    });
  });

  it("convierte la URL a los parámetros de la API", () => {
    const serviceId = "6f1c2a3b-1234-4abc-8def-0123456789ab";
    expect(toListParams(parseFilters({ query: " luz ", documentType: "INVOICE", serviceId, page: "2" }))).toEqual({
      query: "luz",
      documentType: "INVOICE",
      serviceId,
      page: 1,
      size: PAGE_SIZE,
    });
  });
});
