/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/api/proxy/auth-proxy/:path*",
      },
    ];
  },
};

module.exports = nextConfig;