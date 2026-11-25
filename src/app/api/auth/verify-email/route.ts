import { forward, readJson } from "@/lib/server/route-helpers";

/** Confirma el email con el token recibido. */
export async function POST(request: Request) {
  return forward("/auth/verify-email", await readJson(request));
}
