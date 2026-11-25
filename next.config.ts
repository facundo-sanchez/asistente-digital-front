import type { NextConfig } from "next";

/**
 * basePath configurable por entorno (NEXT_PUBLIC_BASE_PATH, se lee en build).
 * Vacío = la app vive en la raíz del dominio.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  // Si hay basePath, "/" del dominio lleva a la app
  async redirects() {
    return basePath
      ? [{ source: "/", destination: basePath, permanent: false, basePath: false }]
      : [];
  },
};

export default nextConfig;
