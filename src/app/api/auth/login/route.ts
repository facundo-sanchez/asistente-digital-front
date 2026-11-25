import { backendFetch } from "@/lib/server/backend";
import { readJson, sessionResponse } from "@/lib/server/route-helpers";

/** Inicia sesión: guarda los tokens en cookies httpOnly y devuelve { user }. */
export async function POST(request: Request) {
  const body = await readJson(request);
  return sessionResponse(() => backendFetch("/auth/login", { method: "POST", body }));
}
