import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: 'http://localhost:5173/admin',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: 'http://localhost:5173/admin/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
