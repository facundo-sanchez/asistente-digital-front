import { forward, readJson } from "@/lib/server/route-helpers";

/** Pide el enlace de reseteo. El backend responde 202 siempre. */
export async function POST(request: Request) {
  return forward("/auth/forgot-password", await readJson(request));
}
