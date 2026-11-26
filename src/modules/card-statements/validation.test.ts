import { describe, expect, it } from "vitest";
import { statementSchema } from "./validation";

describe("formulario de resumen", () => {
  it("alcanza con el vencimiento; los importes vacíos valen 0", () => {
    expect(statementSchema.isValidSync({ dueDate: "2027-01-05" })).toBe(true);
  });

  it("el vencimiento no es anterior al cierre y los importes son válidos", () => {
    expect(statementSchema.isValidSync({ dueDate: "2026-12-20", closingDate: "2026-12-24" })).toBe(false);
    expect(statementSchema.isValidSync({ dueDate: "2027-01-05", totalAmountUsd: "40,5x" })).toBe(false);
  });
});
