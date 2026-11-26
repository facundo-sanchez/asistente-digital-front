import { describe, expect, it } from "vitest";
import { invoiceSchema } from "./validation";

const base = { service: { id: "s", name: "Luz casa" }, dueDate: "2026-12-15", totalAmount: "48500,50", currency: "ARS" };

describe("formulario de factura", () => {
  it("alcanza con servicio, vencimiento e importe", () => {
    expect(invoiceSchema.isValidSync(base)).toBe(true);
  });

  it("exige servicio y un vencimiento no anterior a la emisión", () => {
    expect(invoiceSchema.isValidSync({ ...base, service: null })).toBe(false);
    expect(invoiceSchema.isValidSync({ ...base, issueDate: "2026-12-20" })).toBe(false);
    expect(invoiceSchema.isValidSync({ ...base, issueDate: "2026-12-01" })).toBe(true);
  });
});
