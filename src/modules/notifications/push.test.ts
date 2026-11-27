import { describe, expect, it } from "vitest";
import { urlBase64ToBytes } from "./push";

describe("clave VAPID", () => {
  it("pasa de base64url (sin relleno) a bytes", () => {
    expect(Array.from(urlBase64ToBytes("AQID_-8"))).toEqual([1, 2, 3, 255, 239]);
  });
});
