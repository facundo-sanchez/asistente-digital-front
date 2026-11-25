import type { CookieOptions } from "./cookie-options";

/** Lo que tienen en común cookies() de next/headers y NextResponse.cookies. */
export interface CookieWriter {
  set(name: string, value: string, options?: Partial<CookieOptions>): unknown;
}
