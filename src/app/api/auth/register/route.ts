import { backendFetch } from "@/lib/server/backend";
import { readJson, sessionResponse } from "@/lib/server/route-helpers";

/** Crea la cuenta y deja la sesión iniciada. Devuelve { user } (201). */
export async function POST(request: Request) {
  const body = await readJson(request);
  return sessionResponse(() => backendFetch("/auth/register", { method: "POST", body }));
}
