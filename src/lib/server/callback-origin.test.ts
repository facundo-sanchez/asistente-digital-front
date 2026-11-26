import { describe, expect, it } from "vitest";
import { callbackOrigin } from "./callback-origin";

describe("origen de la vuelta desde Google", () => {
  it("sale del redirect_uri de la URL de autorización", () => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=x&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fasistente-digital%2Fapi%2Fauth%2Fgoogle%2Fcallback";
    expect(callbackOrigin(url)).toBe("http://localhost:3000");
  });

  it("sin redirect_uri o con una URL rota, no hay origen", () => {
    expect(callbackOrigin("https://accounts.google.com/o/oauth2/v2/auth")).toBeNull();
    expect(callbackOrigin("no es una url")).toBeNull();
  });
});
