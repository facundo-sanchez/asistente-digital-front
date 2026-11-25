import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { codeChallengeOf, createGoogleOAuthState, readGoogleOAuthState, stateMatches } from "./google-oauth";

const cookieJar = (value: string | undefined) => ({
  get: () => (value === undefined ? undefined : { value }),
});

describe("login con Google (BFF)", () => {
  it("genera state y verifier distintos en cada intento, y valida el next", () => {
    const a = createGoogleOAuthState("https://evil.example.com");
    const b = createGoogleOAuthState("/profile");

    expect(a.state).not.toBe(b.state);
    expect(a.codeVerifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(a.next).toBe("/dashboard");
    expect(b.next).toBe("/profile");
  });

  it("el code challenge es el SHA-256 del verifier en base64url (PKCE S256)", () => {
    const verifier = "v".repeat(43);
    expect(codeChallengeOf(verifier)).toBe(createHash("sha256").update(verifier).digest("base64url"));
  });

  it("solo acepta el state guardado", () => {
    expect(stateMatches("abc123", "abc123")).toBe(true);
    expect(stateMatches("abc123", "abc124")).toBe(false);
    expect(stateMatches("abc123", "abc")).toBe(false);
    expect(stateMatches("abc123", null)).toBe(false);
  });

  it("descarta una cookie ausente, alterada o con un next externo", () => {
    expect(readGoogleOAuthState(cookieJar(undefined))).toBeNull();
    expect(readGoogleOAuthState(cookieJar("no-es-json"))).toBeNull();
    expect(readGoogleOAuthState(cookieJar(JSON.stringify({ state: "s" })))).toBeNull();

    const tampered = JSON.stringify({ state: "s", codeVerifier: "v", next: "//evil.example.com" });
    expect(readGoogleOAuthState(cookieJar(tampered))?.next).toBe("/dashboard");
  });
});
