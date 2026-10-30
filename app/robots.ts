import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Здесь запрещаем админку и логин
      disallow: ['/admin/', '/api/', '/affiliate/', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}