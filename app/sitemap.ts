import { MetadataRoute } from 'next'
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://casinosearch.fr";

    // 1. Получаем данные из БД параллельно (для скорости)
    const [articles, casinos, categories] = await Promise.all([
        // Только опубликованные статьи
        prisma.article.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        }),
        // Все казино
        prisma.casino.findMany({
            select: { slug: true, updatedAt: true },
        }),
        // Все категории
        prisma.category.findMany({
            select: { slug: true, createdAt: true }, // У категорий нет updatedAt, берем createdAt
        }),
    ]);

    // 2. Генерируем URL для динамических страниц

    const articleUrls = articles.map((article: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const casinoUrls = casinos.map((casino: { slug: string; updatedAt: Date }) => ({
        url: `${baseUrl}/casinos/${casino.slug}`,
        lastModified: casino.updatedAt,
        changeFrequency: 'daily' as const, // Казино могут менять бонусы, ставим daily
        priority: 0.9, // Высокий приоритет для коммерческих страниц
    }));

    const categoryUrls = categories.map((category: { slug: string; createdAt: Date }) => ({
        url: `${baseUrl}/categories/${category.slug}`,
        lastModified: category.createdAt, // Или new Date(), если важно обновлять часто
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 3. Статические страницы
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/casinos`, // Страница листинга казино
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`, // Страница листинга категорий
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/articles`, // Страница блога
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        // Служебные страницы (приоритет ниже)
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/politique-confidentialite`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/responsable-jeu`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // 4. Объединяем все массивы
    return [...staticPages, ...categoryUrls, ...casinoUrls, ...articleUrls];
}