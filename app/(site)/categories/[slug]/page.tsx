import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import Bg from "@/components/Bg";
import Stars from "@/components/Stars"; // Импортируем компонент звезд
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// ISR: Обновляем кэш раз в час
export const revalidate = 3600;

type ParamsP = Promise<{ slug: string }>;

// --- Кэшированный запрос к БД ---
// Вызывается и в метаданных, и в компоненте, но выполняется 1 раз
const getCategory = cache(async (slug: string) => {
    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: true,
            children: true,
            _count: { select: { casinos: true } },
            casinos: {
                where: { rating: { not: null } }, // Показываем только казино с рейтингом
                include: {
                    links: { where: { isPrimary: true }, take: 1 },
                },
                orderBy: { rating: "desc" },
            },
        },
    });
    return category;
});

// ─── SEO META ────────────────────────────────────────────────
export async function generateMetadata(props: { params: ParamsP }): Promise<Metadata> {
    const { slug } = await props.params;
    const category = await getCategory(slug);

    if (!category) return { title: "Catégorie introuvable" };

    const count = category._count.casinos;
    const title = `${category.name} — Meilleurs Casinos en ligne (${new Date().getFullYear()})`;
    const description = `Comparatif des ${count} meilleurs casinos de la catégorie "${category.name}". Avis certifiés, bonus exclusifs et retraits rapides.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `${siteUrl}/categories/${category.slug}`,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Casino Search",
        },
        alternates: {
            canonical: `${siteUrl}/categories/${category.slug}`,
        },
    };
}

// ─── PAGE ────────────────────────────────────────────────────
export default async function CategoryPage(props: { params: ParamsP }) {
    const { slug } = await props.params;
    const category = await getCategory(slug);

    if (!category) notFound();

    const { children, casinos } = category;

    // Schema.org для страницы категории (CollectionPage)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name,
        "description": `Liste des casinos en ligne : ${category.name}`,
        "url": `${siteUrl}/categories/${category.slug}`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": casinos.map((casino, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${siteUrl}/casinos/${casino.slug}`,
                "name": casino.name
            }))
        }
    };

    return (
        <div className="Home">
            <Bg />

            {/* Вставка JSON-LD */}
            <Script
                id="category-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className="home-hero container">
                <nav className="section-head2" aria-label="Fil d’Ariane" style={{ marginBottom: 16, display: 'flex', gap: 8, fontSize: '0.9rem', color: 'var(--sec-text-color)' }}>
                    <a href="/categories" style={{ textDecoration: 'none', color: 'inherit' }}>Catégories</a>
                    <span>/</span>
                    <span style={{ color: 'var(--white-color)' }}>{category.name}</span>
                </nav>

                <h1 className="home-hero__title">
                    {category.name}{" "}
                    {category.parent && (
                        <span className="home-hero__subtitle" style={{ display: 'block', fontSize: '0.5em', marginTop: 10 }}>
                            ({category.parent.name})
                        </span>
                    )}
                </h1>

                <p className="home-hero__subtitle">
                    Découvrez les meilleurs casinos en ligne de la catégorie{" "}
                    <strong>{category.name}</strong>, sélectionnés pour leur fiabilité et leurs bonus attractifs.
                </p>
            </section>

            {/* sous-catégories */}
            {children.length > 0 && (
                <section className="home-section container">
                    <div className="section-head">
                        <h2>Sous-catégories</h2>
                    </div>
                    <div className="cat-grid">
                        {children.map((c: any) => (
                            <a key={c.id} href={`/categories/${c.slug}`} className="cat-card">
                                <span className="cat-card__dot" />
                                <span className="cat-card__name">{c.name}</span>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* casinos */}
            {casinos.length > 0 ? (
                <section className="home-section container">
                    <div className="section-head">
                        <h2>Top Casinos {category.name}</h2>
                    </div>

                    <div className="casino-grid">
                        {casinos.map((c: any) => {
                            const primary = c.links?.[0];
                            const ctaHref = primary
                                ? `/out/${primary.id}?source=category_${category.slug}`
                                : `/casinos/${c.slug}`;

                            return (
                                <article key={c.id} className="content casino-card__container">
                                    {/* Next/Image с fill требует relative у родителя */}
                                    <div className="casino-card__logo" style={{ position: "relative" }}>
                                        <Image
                                            src={c.logoUrl || '/placeholder.png'}
                                            alt={`Avis ${c.name}`}
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
                                        {/* Используем компонент Stars вместо ручного SVG */}
                                        <div className="casino-card__rating">
                                            <Stars
                                                value={c.rating ?? 0}
                                                id={c.id}
                                            />
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
            ) : (
                <section className="home-section container">
                    <p className="empty" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--sec-text-color)' }}>
                        Aucun casino disponible dans cette catégorie pour le moment.
                    </p>
                </section>
            )}
        </div>
    );
}