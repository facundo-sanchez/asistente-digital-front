import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

const SIZES: Record<string, { side: number; rosette: number }> = {
  "192": { side: 192, rosette: 168 },
  "512": { side: 512, rosette: 448 },
  // Maskable: el sistema recorta en círculo o en gota; la roseta queda dentro de la zona segura (80 %)
  maskable: { side: 512, rosette: 330 },
};

/** Íconos de la app instalable: la roseta guilloché en verde agua sobre tinta petróleo. */
export async function GET(_request: Request, { params }: { params: Promise<{ size: string }> }) {
  const size = SIZES[(await params).size];
  if (!size) return new Response("No encontrado", { status: 404 });
  const svg = (await readFile(path.join(process.cwd(), "public/brand/guilloche.svg"), "utf8")).replace('stroke="#000"', 'stroke="#8CC5B6"');
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F2328" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse dibuja con <img>, no con next/image */}
        <img src={src} width={size.rosette} height={size.rosette} alt="" />
      </div>
    ),
    { width: size.side, height: size.side, headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
