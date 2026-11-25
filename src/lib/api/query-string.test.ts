import { describe, expect, it } from "vitest";
import { toQueryString } from "./query-string";

describe("toQueryString", () => {
  it("omite los valores vacíos", () => {
    expect(toQueryString({ query: "coope", category: undefined, page: 0, size: null, other: "" })).toBe("?query=coope&page=0");
  });

  it("devuelve vacío si no queda ningún parámetro", () => {
    expect(toQueryString({ query: "" })).toBe("");
  });

  it("codifica los caracteres especiales", () => {
    expect(toQueryString({ query: "agua & luz" })).toBe("?query=agua+%26+luz");
  });
});
