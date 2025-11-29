/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [50, 60, 75, 85, 90]
  },
  async rewrites() {
    return [
      // Прокси только для API
      {
        source: "/admin/api/:path*",
        destination: "/api/proxy/auth-proxy/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
