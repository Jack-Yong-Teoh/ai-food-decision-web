import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    scrollRestoration: true,
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/recommend",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
