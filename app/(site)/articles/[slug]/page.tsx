import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Bg from "@/components/Bg";
import { mdToPlain } from "@/utils/mdToPlain";

// ISR: Обновляем статью раз в час
export const revalidate = 3600;

// Хелпер для расчета времени чтения
function readingTime(text: string) {
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

// Кэшированный запрос к БД (Metadata + Page используют один и тот же результат)
const getArticle = cache(async (slug: string) => {
    const article = await prisma.article.findUnique({
        where: { slug, published: true },
        include: { categories: true },
    });
    return article;
});

// Кэшированный запрос для виджета казино (чтобы не грузить лишнее)
const getTopCasino = cache(async () => {
    return await prisma.casino.findFirst({
        where: { rating: { not: null } },
        orderBy: { rating: "desc" },
        select: { name: true, logoUrl: true, rating: true, slug: true, links: { where: { isPrimary: true }, take: 1 } }
    });
});

type ParamsP = Promise<{ slug: string }>;

export async function generateMetadata(props: { params: ParamsP }): Promise<Metadata> {
    const { slug } = await props.params;
    const article = await getArticle(slug);

    if (!article) return { title: "Article introuvable" };

    const plainText = mdToPlain(article.bodyMd);
    const description = plainText.slice(0, 160);
    // Лучше использовать реальную картинку статьи, если она есть в БД (поле imageUrl)
    const ogImage = `${process.env.NEXT_PUBLIC_SITE_URL}/logo.webp`; 

    return {
        title: article.title,
        description,
        openGraph: {
            title: article.title,
            description,
            type: "article",
            publishedTime: article.createdAt.toISOString(),
            modifiedTime: article.updatedAt.toISOString(),
            images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
        },
    };
}

export default async function ArticlePage(props: { params: ParamsP }) {
    const { slug } = await props.params;
    const [article, topCasino] = await Promise.all([
        getArticle(slug),
        getTopCasino()
    ]);

    if (!article) notFound();

    const plainText = mdToPlain(article.bodyMd);
    const readMin = readingTime(plainText);
    const dateStr = new Date(article.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    // Рендер Markdown (Серверный)
    const MarkdownIt = (await import("markdown-it")).default;
    const md = new MarkdownIt({ linkify: true, breaks: true, html: false }); // HTML false для безопасности
    const htmlContent = md.render(article.bodyMd);

    // Похожие статьи
    const related = await prisma.article.findMany({
        where: {
            id: { not: article.id },
            published: true,
            categories: { some: { id: { in: article.categories.map(c => c.id) } } }
        },
        take: 3,
        orderBy: { createdAt: "desc" }
    });

    // Schema.org BlogPosting
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "datePublished": article.createdAt.toISOString(),
        "dateModified": article.updatedAt.toISOString(),
        "author": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME || "CasinoSearch"
        },
        "description": plainText.slice(0, 160)
    };

    const ctaLink = topCasino?.links?.[0] ? `/out/${topCasino.links[0].id}?source=article_sidebar` : "#";

    return (
        <div className="ArticlePage">
            <Bg />
            <Script id="article-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HEADER */}
            <div className="ap-header">
                <div className="container">
                    <nav className="breadcrumbs">
                        <a href="/">Accueil</a> / <a href="/articles">Articles</a> / <span>{article.title}</span>
                    </nav>
                    
                    <div className="ap-meta">
                        {article.categories[0] && <span className="cat-badge">{article.categories[0].name}</span>}
                        <span className="date">{dateStr}</span>
                        <span className="read-time">⏱ {readMin} min</span>
                    </div>

                    <h1 className="ap-title">{article.title}</h1>
                </div>
            </div>

            <div className="container ap-layout">
                {/* CONTENT COLUMN */}
                <main className="ap-content">
                    <article className="prose" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </main>

                {/* SIDEBAR */}
                <aside className="ap-sidebar">
                    <div className="sticky-wrapper">
                        {/* Виджет "Топ Казино" - повышает конверсию */}
                        {topCasino && (
                            <div className="sidebar-widget">
                                <div className="sw-head">🏆 Top Casino</div>
                                <div className="sw-body">
                                    <div className="sw-logo">
                                        <Image src={topCasino.logoUrl || "/placeholder.png"} alt={topCasino.name} fill style={{objectFit: "cover"}} />
                                    </div>
                                    <div className="sw-info">
                                        <div className="sw-name">{topCasino.name}</div>
                                        <div className="sw-rating">Note: {(topCasino.rating ? topCasino.rating / 20 : 0).toFixed(1)}/5</div>
                                    </div>
                                    <a href={ctaLink} className="sw-btn" target="_blank" rel="nofollow">JOUER</a>
                                </div>
                            </div>
                        )}
                        
                        {/* Виджет "Похожие статьи" */}
                        {related.length > 0 && (
                            <div className="sidebar-list">
                                <h3>À lire aussi</h3>
                                {related.map(r => (
                                    <a key={r.id} href={`/articles/${r.slug}`} className="sl-item">
                                        {r.title}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}