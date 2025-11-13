export const dynamic = "force-dynamic"; // ставим вверху файла

import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import { mdToPlain } from "@/utils/mdToPlain";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Walixway";

export async function generateMetadata(): Promise<Metadata> {
    // Берём последний опубликованный article для более «свежего» OG-preview
    const latest = await prisma.article.findFirst({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: { title: true, bodyMd: true, slug: true },
    });

    const defaultDesc =
        "Découvrez nos articles sur les casinos en ligne : conseils, actualités, bonus, et stratégies pour jouer intelligemment et en toute sécurité.";

    const description = latest ? mdToPlain(latest.bodyMd).slice(0, 160) : defaultDesc;
    const ogImage = latest ? `${siteUrl}/api/og/article/${latest.slug}` : `${siteUrl}/logo.png`;
    // Пример: можно иметь route для генерации OG-изображений /api/og/article/[slug]

    return {
        title: "Articles sur les casinos en ligne — France",
        description,
        openGraph: {
            title: "Articles sur les casinos en ligne — France",
            description,
            url: `${siteUrl}/articles`,
            siteName,
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: `${siteName} — Articles`,
                },
            ],
        },
        alternates: { canonical: `${siteUrl}/articles` },
    };
}

export default async function ArticlesPage() {
    const articles = await prisma.article.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    return (
        <div className="Home">
            <Bg />

            <section className="home-hero container">
                <h1 className="home-hero__title">
                    Articles sur les <span>casinos en ligne</span>
                </h1>
                <p className="home-hero__subtitle">
                    Lisez les dernières actualités, analyses et guides sur les casinos en ligne. Découvrez
                    comment profiter des meilleurs bonus et jouer en toute sécurité.
                </p>
            </section>

            <section className="home-section container">
                <div className="section-head">
                    <h2>Derniers articles</h2>
                    <p className="home-hero__subtitle">Mises à jour régulières de nos experts</p>
                </div>

                {articles.length > 0 ? (
                    <div className="article-grid">
                        {articles.map((a) => (
                            <article key={a.id} className="article-card">
                                <h3 className="article-card__title">
                                    <a href={`/articles/${a.slug}`}>{a.title}</a>
                                </h3>
                                <p className="article-card__excerpt">
                                    {mdToPlain(a.bodyMd).slice(0, 120)}
                                    {a.bodyMd.length > 180 ? "…" : ""}
                                </p>
                                <a className="article-card__more" href={`/articles/${a.slug}`}>
                                    Lire l’article →
                                </a>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className="empty">Aucun article publié pour le moment.</p>
                )}
            </section>
        </div>
    );
}
