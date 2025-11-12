/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/api/proxy/auth-proxy/:path*",
        assetPrefix: process.env.NEXT_PUBLIC_URL
      },
    ];
  },
};

module.exports = nextConfig;