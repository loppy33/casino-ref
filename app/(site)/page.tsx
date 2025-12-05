import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import Bg from "@/components/Bg";
import Stars from "@/components/Stars";
import { prisma } from "@/lib/db";
import MarkdownIt from "markdown-it";

// ВАЖНО: Используем ISR (обновление раз в 10 минут) вместо force-dynamic.
// Это ускорит сайт, но не сломает верстку.
export const revalidate = 600;

function getMarkdownPreview(md: string, maxChars: number = 1500) {
    // Убираем лишние пробелы
    let clean = md.trim();

    // Если длина больше лимита
    if (clean.length > maxChars) {
        // Обрезаем до лимита
        clean = clean.slice(0, maxChars);

        // Обрезаем до последнего пробела, чтобы не резать слово или Markdown
        const lastSpace = clean.lastIndexOf(" ");
        if (lastSpace > 0) {
            clean = clean.slice(0, lastSpace);
        }

        // Добавляем нормальное многоточие
        clean += "…";
    }

    const mdParser = new MarkdownIt({ linkify: true, breaks: true, html: false });
    return mdParser.render(clean);
}
export default async function Home() {
    const [topCasinos, popularCategories, latestArticles] = await Promise.all([
        prisma.casino.findMany({
            where: { rating: { not: null } },
            orderBy: { rating: "desc" },
            take: 8,
            include: { links: { where: { isPrimary: true }, take: 1 } },
        }),
        prisma.category.findMany({
            take: 8,
            orderBy: { casinos: { _count: "desc" } },
            include: { _count: { select: { casinos: true } } },
        }),
        prisma.article.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            take: 6,
        }),
    ]);

    // Schema.org JSON-LD (Невидим для пользователя, не ломает верстку)
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": topCasinos.map((casino, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Organization",
                "name": casino.name,
                "image": casino.logoUrl
            }
        }))
    };

    return (
        <div className="Home">
            <Script
                id="home-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

            <Bg />

            {/* HERO */}
            <section className="home-hero container">
                <h1 className="home-hero__title">
                    Jouez sur les casinos en ligne <span>France vérifiés</span>
                </h1>
                <p className="home-hero__subtitle">
                    Profitez des meilleurs casinos en ligne France, avec des bonus transparents et des retraits rapides.
                    Chaque site est sélectionné pour sa fiabilité et son cadre de jeu sécurisé. Jouez en toute confiance et
                    recevez vos gains sans délai.
                </p>
                <p className="home-hero__seo">
                    Notre plateforme compare les casinos en ligne fiables, offrant des guides complets, des astuces pour
                    maximiser vos gains et des critiques détaillées de chaque casino. Découvrez comment choisir un casino
                    sûr et profiter des meilleures promotions disponibles.
                </p>

                <div className="home-hero__stats">
                    <div className="stat">
                        <div className="stat__num">{topCasinos.length}</div>
                        <div className="stat__label">Casinos mis en avant</div>
                        <p className="stat__seo">
                            Ces casinos ont été sélectionnés pour leur fiabilité, leur rapidité de paiement et la qualité de leurs
                            bonus.
                        </p>
                    </div>
                    <div className="stat">
                        <div className="stat__num">{popularCategories.length}</div>
                        <div className="stat__label">Catégories populaires</div>
                        <p className="stat__seo">
                            Explorez les catégories les plus populaires, des machines à sous aux jeux de table, pour trouver le
                            casino qui vous convient.
                        </p>
                    </div>
                    <div className="stat">
                        <div className="stat__num">{latestArticles.length}</div>
                        <div className="stat__label">Articles récents</div>
                        <p className="stat__seo">
                            Lisez nos derniers guides et astuces pour comprendre les bonus, tours gratuits et stratégies des
                            casinos en ligne.
                        </p>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            {popularCategories.length > 0 && (
                <section className="home-section container">
                    <div className="section-head">
                        <h2>Catégories populaires</h2>
                        <a className="section-head__link" href="/categories">
                            Toutes les catégories →
                        </a>
                    </div>

                    <div className="cat-grid">
                        {popularCategories.map((c: any) => (
                            <a key={c.id} href={`/categories/${c.slug}`} className="cat-card">
                                <span className="cat-card__dot" />
                                <span className="cat-card__name">{c.name}</span>
                                <span className="cat-card__count">{c._count?.casinos ?? 0}</span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* TOP CASINOS */}
            {topCasinos.length > 0 && (
                <section className="home-section container">
                    <div className="section-head">
                        <h2>Top casinos</h2>
                        <a className="section-head__link" href="/casinos">
                            Voir tout →
                        </a>
                    </div>

                    <div className="casino-grid">
                        {topCasinos.map((c: any) => {
                            const primary = c.links?.[0];
                            const ctaHref = primary ? `/out/${primary.id}?source=seo` : `/casinos/${c.slug}`;
                            return (
                                <article key={c.id} className="content casino-card__container">
                                    {/* ВАЖНО: Добавлен style={{ position: "relative" }} 
                                        Без этого Next/Image с prop "fill" сломает верстку.
                                    */}
                                    <div className="casino-card__logo" style={{ position: "relative" }}>
                                        <Image
                                            src={c.logoUrl || '/placeholder.png'}
                                            alt={c.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            style={{ objectFit: "cover", borderRadius: "10px" }}
                                            className="casino-img"
                                        />
                                    </div>
                                    <div className="casino-card__meta">
                                        <h3 className="casino-card__title">
                                            <a href={`/casinos/${c.slug}`}>{c.name}</a>
                                        </h3>
                                        <div className="casino-card__rating">
                                            <Stars rating100={c.rating ?? 0} />
                                        </div>
                                    </div>

                                    {c.shortDesc && (
                                        <p className="casino-card__desc">
                                            {c.shortDesc.length > 150 ? c.shortDesc.slice(0, 150) + "…" : c.shortDesc}
                                        </p>
                                    )}

                                    <div className="casino-card__actions">
                                        <a className="btn btn--primary" href={ctaHref}>
                                            Jouer maintenant
                                        </a>
                                        <a className="btn btn--ghost" href={`/casinos/${c.slug}`}>
                                            Détails
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ARTICLES */}
            {latestArticles.length > 0 && (
                <section className="home-section container">
                    <div className="section-head">
                        <h2>Articles récents</h2>
                        <a className="section-head__link" href="/articles">
                            Tous les articles →
                        </a>
                    </div>

                    <div className="article-main">
                        {latestArticles.map((a: any) => {
                            // Безопасное превью без HTML тегов
                            const textPreview = getMarkdownPreview(a.bodyMd, 1500);

                            return (
                                <article key={a.id} className="article-card">
                                    <h3 className="article-card__title">
                                        <a href={`/articles/${a.slug}`}>{a.title}</a>
                                    </h3>

                                    {/* Используем <p> вместо вложенного <article>, 
                                        но с классом, который (вероятно) унаследует цвет текста
                                    */}
                                    {/* <p 
                                        className="article-card__excerpt" 
                                        style={{ margin: "0 14px 14px", color: "var(--sec-text-color)" }}
                                    >
                                        {textPreview}
                                    </p> */}
                                    <div className="prose" style={{ margin: "0 14px 14px", color: "var(--sec-text-color)" }} dangerouslySetInnerHTML={{ __html: textPreview }} />

                                    <a className="article-card__more" href={`/articles/${a.slug}`}>
                                        Lire l’article →
                                    </a>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}