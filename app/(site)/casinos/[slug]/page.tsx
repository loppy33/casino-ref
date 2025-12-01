import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Stars from "@/components/Stars";

type ParamsP = { slug?: string };
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "";

// ── SEO: динамические метаданные для страницы казино
export async function generateMetadata({ params }: { params: ParamsP }): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    if (!slug) return {};

    const casino = await prisma.casino.findUnique({
        where: { slug },
        include: { categories: true },
    });

    if (!casino) {
        return {
            title: `Casino introuvable — ${siteName}`,
            description: "Ce casino n’existe pas ou n’est plus disponible.",
        };
    }

    const title = `${casino.name} — avis, bonus et fiabilité`;
    const description =
        casino.shortDesc ||
        `Découvrez ${casino.name} : avis, licence ${casino.license || "internationale"}, dépôt minimum${casino.minDeposit ? ` ${casino.minDeposit}€` : ""
        } et sécurité. Jouez en toute confiance sur un site vérifié.`;

    const ogImage = casino.logoUrl
        ? [{ url: casino.logoUrl, width: 1200, height: 630, alt: casino.name }]
        : [{ url: `${siteUrl}/logo.webp`, width: 1200, height: 630, alt: siteName }];

    const canonical = `${siteUrl}/casinos/${casino.slug}`;

    return {
        title,
        description,
        keywords: [
            casino.name,
            "casino en ligne",
            "bonus casino",
            "casino France",
            "jeux d’argent",
            "machines à sous",
            "blackjack en ligne",
            ...(casino.categories?.map((c: any) => c.name.toLowerCase()) ?? []),
        ],
        openGraph: {
            title,
            description,
            type: "website",
            url: canonical,
            siteName,
            locale: "fr_FR",
            images: ogImage,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage.map((i) => i.url),
        },
        alternates: { canonical },
        robots: { index: true, follow: true },
    };
}


export default async function CasinoPage({ params }: { params: ParamsP }) {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) notFound();

    // Тянем казино + «похожие» (из тех же категорий), без текущего
    const casino = await prisma.casino.findUnique({
        where: { slug },
        include: {
            links: { where: { isPrimary: true }, take: 1 },
            categories: true,
        },
    });
    if (!casino) notFound();

    const categoryIds = casino.categories.map((c: any) => c.id);
    const similar = categoryIds.length
        ? await prisma.casino.findMany({
            where: {
                id: { not: casino.id },
                categories: { some: { id: { in: categoryIds } } },
                rating: { not: null },
            },
            orderBy: { rating: "desc" },
            include: { links: { where: { isPrimary: true }, take: 1 } },
            take: 6,
        })
        : [];

    const primary = casino.links?.[0];
    const ctaHref = primary ? `/out/${primary.id}?source=detail` : "#";

    // JSON-LD (Organization + AggregateRating) + Breadcrumbs
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Casinos", item: `${siteUrl}/casinos` },
                    { "@type": "ListItem", position: 2, name: casino.name, item: `${siteUrl}/casinos/${casino.slug}` },
                ],
            },
            {
                "@type": "Organization",
                name: casino.name,
                url: `${siteUrl}/casinos/${casino.slug}`,
                logo: casino.logoUrl || undefined,
                aggregateRating:
                    typeof casino.rating === "number"
                        ? {
                            "@type": "AggregateRating",
                            ratingValue: (casino.rating / 20).toFixed(1), // 0..5
                            bestRating: "5",
                            worstRating: "0",
                            ratingCount: 1,
                        }
                        : undefined,
            },
        ],
    };

    return (
        <div className="CasinoPage">
            <Bg />

            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO */}
            <section className="cp-hero container">
                <nav className="cp-breadcrumbs" aria-label="Fil d’Ariane">
                    <a href="/casinos">Casinos</a>
                    <span aria-hidden="true">/</span>
                    <span className="current" aria-current="page">
                        {casino.name}
                    </span>
                </nav>

                <div className="cp-hero__top">
                    <div className="cp-hero__logo" aria-hidden>
                        {casino.logoUrl ? (
                            <img src={casino.logoUrl} alt="" />
                        ) : (
                            <div className="cp-hero__logo--placeholder" />
                        )}
                    </div>

                    <div className="cp-hero__meta">
                        <h1 className="cp-hero__title">{casino.name}</h1>
                        <Stars rating100={casino.rating ?? 0} />
                        {casino.shortDesc && <p className="cp-hero__subtitle">{casino.shortDesc}</p>}

                        <div className="cp-hero__chips">
                            {casino.license && <span className="chip chip--license">Licence: {casino.license}</span>}
                            {typeof casino.minDeposit === "number" && (
                                <span className="chip">Dépôt min: {casino.minDeposit}€</span>
                            )}
                            {casino.is18plus && <span className="chip chip--18plus">18+</span>}
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="cp-content container">
                <div className="cp-grid">
                    {/* ЛЕВАЯ КОЛОНКА: факты / плюсы / минусы */}
                    <article className="cp-card">
                        <h2 className="cp-h2">Informations clés</h2>
                        <ul className="cp-facts">
                            {casino.license && (
                                <li>
                                    <span>Licence</span>
                                    <b>{casino.license}</b>
                                </li>
                            )}
                            {typeof casino.minDeposit === "number" && (
                                <li>
                                    <span>Dépôt minimum</span>
                                    <b>{casino.minDeposit}€</b>
                                </li>
                            )}
                            {casino.categories.length > 0 && (
                                <li>
                                    <span>Catégories</span>
                                    <b className="cp-cats">
                                        {casino.categories.map((cat: any, i: any) => (
                                            <a key={cat.id} href={`/categories/${cat.slug}`} className="cp-link">
                                                {cat.name}
                                                {i < casino.categories.length - 1 ? ", " : ""}
                                            </a>
                                        ))}
                                    </b>
                                </li>
                            )}
                        </ul>

                        {casino.pros?.length ? (
                            <div className="cp-list-block">
                                <h3 className="cp-h3 good">Avantages</h3>
                                <ul className="cp-list cp-list--pros">
                                    {casino.pros.map((p: any, i: any) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {casino.cons?.length ? (
                            <div className="cp-list-block">
                                <h3 className="cp-h3 bad">Inconvénients</h3>
                                <ul className="cp-list cp-list--cons">
                                    {casino.cons.map((c: any, i: any) => (
                                        <li key={i}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </article>

                    {/* ПРАВАЯ КОЛОНКА: блок действия (липкий) */}
                    <aside className="cp-sticky">
                        <div className="cp-card cp-sticky__card" role="complementary" aria-label="Action">
                            <div className="cp-sticky__logo" aria-hidden>
                                {casino.logoUrl ? <img src={casino.logoUrl} alt="" /> : <div className="ph" />}
                            </div>
                            <div className="cp-sticky__title">{casino.name}</div>
                            <Stars rating100={casino.rating ?? 0} />
                            <a className="btn-primary btn-primary--wide" href={ctaHref}>
                                Jouer maintenant
                            </a>
                            {primary && (
                                <a className="btn-ghost btn-ghost--wide" href={`/out/${primary.id}?source=detail`} target="_blank">
                                    Visiter le site
                                </a>
                            )}
                            <p className="cp-sticky__note">Jeu responsable. 18+.</p>
                        </div>
                    </aside>
                </div>
            </section>

            {/* SIMILAIRES */}
            <section className="cp-similar container">
                <div className="cp-similar__head">
                    <h2 className="cp-h2">Casinos similaires</h2>
                    {casino.categories[0] && (
                        <a className="cp-link" href={`/categories/${casino.categories[0].slug}`}>
                            Voir la catégorie →
                        </a>
                    )}
                </div>

                {similar.length ? (
                    <div className="cp-similar__grid">
                        {similar.map((s: any) => {
                            const pl = s.links?.[0];
                            const href = pl ? `/out/${pl.id}?source=similar` : `/casinos/${s.slug}`;
                            return (
                                <article key={s.id} className="cp-sim-card">
                                    <div className="cp-sim-card__logo" aria-hidden>
                                        {s.logoUrl ? <img src={s.logoUrl} alt="" /> : <div className="ph" />}
                                    </div>
                                    <h3 className="cp-sim-card__title">
                                        <a href={`/casinos/${s.slug}`}>{s.name}</a>
                                    </h3>
                                    <Stars rating100={s.rating ?? 0} />
                                    {s.shortDesc.length > 150 ? s.shortDesc.slice(0, 150) + "…" : s.shortDesc}
                                    <div className="cp-sim-card__actions">
                                        <a className="btn-primary" href={href}>Jouer</a>
                                        <a className="btn-ghost" href={`/casinos/${s.slug}`}>Détails</a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="cp-empty">Aucun casino similaire pour l’instant.</p>
                )}
            </section>

            {/* МОБИЛЬНЫЙ ЛИПКИЙ CTA */}
            <div className="cp-mobile-cta">
                <a className="btn-primary btn-primary--full" href={ctaHref}>Jouer maintenant</a>
            </div>
        </div>
    );
}
