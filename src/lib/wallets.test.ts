import { describe, expect, it } from "vitest";
import { paymentTarget } from "./wallets";

describe("a dónde lleva el botón Pagar", () => {
  const camuzzi = { providerName: "Camuzzi", paymentUrl: "https://camuzzi.example/pagar" };

  it("gana la página de pago del servicio", () => {
    expect(paymentTarget(camuzzi, "MODO")).toEqual({ name: "Camuzzi", url: camuzzi.paymentUrl, label: "Pagar en Camuzzi" });
  });

  it("si el servicio no tiene página, va a la billetera", () => {
    expect(paymentTarget({ ...camuzzi, paymentUrl: null }, "MERCADO_PAGO")?.label).toBe("Pagar con Mercado Pago");
  });

  it("sin ninguna de las dos, no hay botón", () => {
    expect(paymentTarget({ ...camuzzi, paymentUrl: null }, null)).toBeNull();
    expect(paymentTarget(null, null)).toBeNull();
  });
});
