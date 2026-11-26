import { describe, expect, it } from "vitest";
import { cardSchema } from "./validation";

const base = { service: { id: "s", name: "Galicia" }, name: "Visa Galicia", brand: "VISA" };

describe("formulario de tarjeta", () => {
  it("alcanza con banco, nombre y marca", () => {
    expect(cardSchema.isValidSync(base)).toBe(true);
  });

  it("los últimos 4 son exactamente 4 números", () => {
    expect(cardSchema.isValidSync({ ...base, lastFour: "1234" })).toBe(true);
    expect(cardSchema.isValidSync({ ...base, lastFour: "123" })).toBe(false);
    expect(cardSchema.isValidSync({ ...base, accountLastFour: "12a4" })).toBe(false);
  });
});
