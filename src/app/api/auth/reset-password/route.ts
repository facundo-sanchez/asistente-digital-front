import { forward, readJson } from "@/lib/server/route-helpers";

/** Define la contraseña nueva con el token del email. */
export async function POST(request: Request) {
  return forward("/auth/reset-password", await readJson(request));
}
