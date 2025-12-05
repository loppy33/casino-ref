/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    qualities: [50, 60, 75, 85, 90],
    // 👇 ДОБАВЛЕНО: Разрешаем загрузку картинок с внешних доменов
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Исправляет твою текущую ошибку
      },
      {
        protocol: 'https',
        hostname: '**', // Разрешает картинки с ЛЮБЫХ доменов (удобно, если логотипы казино на разных сайтах)
      },
    ],
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