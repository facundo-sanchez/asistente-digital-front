import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output:"standalone",
  basePath: "/mi-balance",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/mi-balance",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
