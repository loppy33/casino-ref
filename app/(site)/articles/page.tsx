import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Articles sur les casinos en ligne — France",
    description:
        "Découvrez nos articles sur les casinos en ligne : conseils, actualités, bonus, et stratégies pour jouer intelligemment et en toute sécurité.",
    openGraph: {
        title: "Articles sur les casinos en ligne — France",
        description:
            "Tous les articles sur les casinos en ligne vérifiés en France. Lisez nos analyses, guides et recommandations d'experts.",
        type: "website",
        url: `${siteUrl}/articles`,
    },
    alternates: {
        canonical: `${siteUrl}/articles`,
    },
};

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
                                    {a.bodyMd.slice(0, 180)}
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
