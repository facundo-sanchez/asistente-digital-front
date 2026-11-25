import { describe, expect, it } from "vitest";
import { HOME_PATH, safeNextPath } from "./config";

/** ?next= solo acepta rutas internas: evita redirigir a otro sitio después del login. */
describe("safeNextPath", () => {
  it("acepta una ruta interna con query", () => {
    expect(safeNextPath("/profile?tab=1")).toBe("/profile?tab=1");
  });

  it.each([
    ["vacío", ""],
    ["sin valor", undefined],
    ["URL absoluta", "https://evil.example.com"],
    ["protocolo relativo", "//evil.example.com"],
    ["barra invertida", "/\\evil.example.com"],
    ["sin barra inicial", "evil.example.com"],
  ])("rechaza %s", (_, next) => {
    expect(safeNextPath(next)).toBe(HOME_PATH);
  });
});
