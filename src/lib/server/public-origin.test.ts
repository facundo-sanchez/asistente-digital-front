import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { publicOrigin } from "./public-origin";

describe("origen público de una request", () => {
  it("usa el host con el que llegó el navegador, no la dirección interna", () => {
    const request = new NextRequest("http://0.0.0.0:3000/dashboard", { headers: { host: "localhost:3000" } });
    expect(publicOrigin(request)).toBe("http://localhost:3000");
  });

  it("detrás de un proxy, respeta el host y el protocolo reenviados", () => {
    const request = new NextRequest("http://0.0.0.0:3000/dashboard", {
      headers: { host: "front:3000", "x-forwarded-host": "app.ejemplo.com", "x-forwarded-proto": "https" },
    });
    expect(publicOrigin(request)).toBe("https://app.ejemplo.com");
  });
});
