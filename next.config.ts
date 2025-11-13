/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // обязательно для App Router
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
