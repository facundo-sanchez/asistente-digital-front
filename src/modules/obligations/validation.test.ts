import { describe, expect, it } from "vitest";
import { obligationSchema, parseAmount } from "./validation";

const base = { title: "VTV", obligationType: "VEHICLE_INSPECTION", currency: "ARS", dueDate: "2026-12-15" };

describe("formulario de obligación", () => {
  it("acepta importe vacío, con punto o con coma decimal", () => {
    for (const amount of ["", "48500", "48500,5", "48500.50"]) {
      expect(obligationSchema.isValidSync({ ...base, amount })).toBe(true);
    }
  });

  it("rechaza importes mal escritos o negativos", () => {
    for (const amount of ["48.500,00", "-10", "1,234", "abc"]) {
      expect(obligationSchema.isValidSync({ ...base, amount })).toBe(false);
    }
  });

  it("convierte el texto del importe a número", () => {
    expect(parseAmount("48500,5")).toBe(48500.5);
    expect(parseAmount(" ")).toBeNull();
  });
});
