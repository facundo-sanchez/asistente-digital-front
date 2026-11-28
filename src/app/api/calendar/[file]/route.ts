import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend";

/**
 * Link iCal público (módulo 19): Google Calendar o el celular lo leen sin sesión; el token del
 * nombre del archivo es la clave. Se sirve desde el dominio del front porque el backend no está expuesto.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[A-Za-z0-9_-]{20,100}\.ics$/.test(file)) {
    return new NextResponse("No encontrado", { status: 404 });
  }
  try {
    const res = await backendFetch(`/calendar/feeds/${file}`, { accept: "text/calendar" });
    if (!res.ok) return new NextResponse("No encontrado", { status: res.status === 404 ? 404 : 502 });
    return new NextResponse(await res.text(), {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'inline; filename="vencimientos.ics"',
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return new NextResponse("El servicio no está disponible", { status: 503 });
  }
}
