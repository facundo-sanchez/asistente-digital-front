import type { NextConfig } from "next";

/**
 * basePath configurable por entorno (NEXT_PUBLIC_BASE_PATH, se lee en build).
 * Vacío = la app vive en la raíz del dominio.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  basePath,
  // Solo en desarrollo: sin esto, al entrar desde otro dispositivo de la red (ej. el celular) Next bloquea su JavaScript
  allowedDevOrigins: ["192.168.1.6"],
  // Si hay basePath, "/" del dominio lleva a la app
  async redirects() {
    return basePath
      ? [{ source: "/", destination: basePath, permanent: false, basePath: false }]
      : [];
  },
};

export default nextConfig;
