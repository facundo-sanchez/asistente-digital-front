import { describe, expect, it } from "vitest";
import { paymentSchema, today } from "./validation";

const base = { amount: "15000", currency: "ARS", paymentDate: today(), paymentMethod: "BANK_TRANSFER" };

describe("formulario de pago", () => {
  it("acepta un pago de hoy con coma decimal", () => {
    expect(paymentSchema.isValidSync({ ...base, amount: "15000,50" })).toBe(true);
  });

  it("rechaza importe cero, vacío o fecha futura", () => {
    expect(paymentSchema.isValidSync({ ...base, amount: "0" })).toBe(false);
    expect(paymentSchema.isValidSync({ ...base, amount: "" })).toBe(false);
    expect(paymentSchema.isValidSync({ ...base, paymentDate: "2999-01-01" })).toBe(false);
  });
});
