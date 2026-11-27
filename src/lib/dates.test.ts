import { describe, expect, it } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  it("formatea una fecha completa y no rompe con una a medio tipear", () => {
    expect(formatDate("2026-11-25")).toBe("25/11/2026");
    expect(formatDate("20261-11-25")).toBeNull();
    expect(formatDate("")).toBeNull();
  });
});
