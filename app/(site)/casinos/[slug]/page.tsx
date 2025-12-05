import { cache } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import Bg from "@/components/Bg";
import Stars from "@/components/Stars";

// --- Кэширование запроса ---
// Это позволяет вызывать getCasino и в metadata, и в компоненте, 
// а запрос к БД будет выполнен только один раз.
const getCasino = cache(async (slug: string) => {
    const casino = await prisma.casino.findUnique({
        where: { slug },
        include: {
            categories: true,
            links: { where: { isPrimary: true }, take: 1 },
        },
    });
    return casino;
});

type ParamsP = Promise<{ slug: string }>;

// --- SEO Metadata ---
export async function generateMetadata(props: { params: ParamsP }): Promise<Metadata> {
    const { slug } = await props.params;
    const casino = await getCasino(slug);

    if (!casino) {
        return {
            title: "Casino introuvable",
            robots: { index: false },
        };
    }
    const year = new Date().getFullYear();
    const title = `Avis ${casino.name} (${year}) : Bonus, Arnaque ou Fiable ?`;
    const description = casino.shortDesc || `Notre avis complet sur ${casino.name}. Vérifiez la licence, les bonus et les retraits avant de jouer.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: casino.logoUrl || "/logo.png", width: 1200, height: 630 }],
        },
    };
}

// --- Компонент Страницы ---
export default async function CasinoPage(props: { params: ParamsP }) {
    const { slug } = await props.params;
    const casino = await getCasino(slug);

    if (!casino) notFound();

    // Поиск похожих казино
    const categoryIds = casino.categories.map((c) => c.id);
    const similar = categoryIds.length
        ? await prisma.casino.findMany({
            where: {
                id: { not: casino.id },
                categories: { some: { id: { in: categoryIds } } },
                rating: { not: null },
            },
            orderBy: { rating: "desc" },
            take: 4, // 4 выглядят лучше в сетке
        })
        : [];

    const primaryLink = casino.links?.[0];
    const ctaHref = primaryLink ? `/out/${primaryLink.id}?source=detail` : "#";

    // --- Schema.org: Review & Product ---
    // Это критически важно для звездочек в Google
    const jsonLd = {
        "@context": "https://schema.org/",
        "@type": "Review",
        "itemReviewed": {
            "@type": "Organization", // Или "Casino" если поддерживается, но Organization надежнее
            "name": casino.name,
            "image": casino.logoUrl,
            "description": casino.shortDesc
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": (casino.rating ? casino.rating / 20 : 0).toFixed(1), // 0-5
            "bestRating": "5",
            "worstRating": "1"
        },
        "author": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME || "CasinoSearch"
        },
        "publisher": {
            "@type": "Organization",
            "name": process.env.NEXT_PUBLIC_SITE_NAME || "CasinoSearch"
        }
    };

    return (
        <div className="CasinoPage">
            <Bg />

            {/* SEO Schema */}
            <Script
                id="review-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO SECTION */}
            <div className="cp-header-wrapper">
                <section className="cp-hero container">
                    {/* Breadcrumbs */}
                    <nav className="cp-breadcrumbs">
                        <a href="/">Accueil</a>
                        <span className="sep">/</span>
                        <a href="/casinos">Casinos</a>
                        <span className="sep">/</span>
                        <span className="current">{casino.name}</span>
                    </nav>

                    <div className="cp-hero__main">
                        <div className="cp-hero__logo-box">
                            <Image
                                src={casino.logoUrl || "/placeholder.png"}
                                alt={`Logo ${casino.name}`}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100px, 160px"
                                priority // Грузим логотип сразу, это LCP
                            />
                        </div>

                        <div className="cp-hero__info">
                            <h1 className="cp-hero__title">
                                Avis <span>{casino.name}</span>
                            </h1>
                            <div className="cp-hero__rating-row">
                                <Stars
                                    value={casino.rating ?? 0}
                                    id={casino.id}
                                />
                                <span className="score">{(casino.rating ? casino.rating / 20 : 0).toFixed(1)}/5</span>
                            </div>

                            <div className="cp-chips">
                                {casino.license && <span className="chip chip--license">🛡 {casino.license}</span>}
                                {typeof casino.minDeposit === 'number' && <span className="chip">💶 Dépôt min: {casino.minDeposit}€</span>}
                                <span className="chip chip--verified">✅ Vérifié</span>
                            </div>
                        </div>

                        <div className="cp-hero__cta desktop-only">
                            <a className="btn-shine" href={ctaHref} target="_blank" rel="nofollow">
                                Jouer Maintenant
                            </a>
                            <div className="sub-cta">Inscription en 2 min</div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="container cp-layout">
                {/* LEFT CONTENT */}
                <main className="cp-main">
                    {/* ПЛЮСЫ И МИНУСЫ (Grid Layout) */}
                    <section className="cp-card cp-pros-cons">
                        <div className="pc-col">
                            <h3>👍 Avantages</h3>
                            <ul>
                                {casino.pros?.map((p, i) => <li key={i}>{p}</li>)}
                                {!casino.pros?.length && <li>Excellente réputation</li>}
                            </ul>
                        </div>
                        <div className="pc-divider"></div>
                        <div className="pc-col">
                            <h3>👎 Inconvénients</h3>
                            <ul className="cons-list">
                                {casino.cons?.map((c, i) => <li key={i}>{c}</li>)}
                                {!casino.cons?.length && <li>Peu de filtres de jeux</li>}
                            </ul>
                        </div>
                    </section>

                    {/* DETAILS TABLE */}
                    <section className="cp-card cp-details">
                        <h2>Détails du casino</h2>
                        <div className="detail-row">
                            <span className="label">Site Web</span>
                            <a href={ctaHref} target="_blank" rel="nofollow" className="value link">{casino.name}</a>
                        </div>
                        <div className="detail-row">
                            <span className="label">Licence</span>
                            <span className="value">{casino.license || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">Catégories</span>
                            <div className="value tags">
                                {casino.categories.map(c => (
                                    <a key={c.id} href={`/categories/${c.slug}`}>{c.name}</a>
                                ))}
                            </div>
                        </div>
                        {casino.shortDesc && (
                            <div className="detail-desc">
                                <h3>Notre avis</h3>
                                <p>{casino.shortDesc}</p>
                            </div>
                        )}
                    </section>
                </main>

                {/* RIGHT SIDEBAR (Sticky) */}
                <aside className="cp-sidebar">
                    <div className="sticky-wrapper">
                        <div className="cp-card widget-play">
                            <div className="widget-logo">
                                <Image
                                    src={casino.logoUrl || "/placeholder.png"}
                                    alt={casino.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className="widget-score">
                                <span>Note globale</span>
                                <strong>{(casino.rating ? casino.rating / 20 : 0).toFixed(1)}/5</strong>
                            </div>
                            <a className="btn-shine full-width" href={ctaHref} target="_blank" rel="nofollow">
                                Visiter le site
                            </a>
                            <p className="terms">18+ Jouez de manière responsable.</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* SIMILAR CASINOS */}
            {similar.length > 0 && (
                <section className="container cp-similar">
                    <h2>Vous aimerez aussi</h2>
                    <div className="similar-grid">
                        {similar.map((s) => (
                            <a key={s.id} href={`/casinos/${s.slug}`} className="sim-card">
                                <div className="sim-logo">
                                    <Image
                                        src={s.logoUrl || "/placeholder.png"}
                                        alt={s.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="200px"
                                    />
                                </div>
                                <div className="sim-info">
                                    <div className="name">{s.name}</div>
                                    <Stars
                                        value={s.rating ?? 0}
                                        id={s.id}
                                    />
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* MOBILE FLOATING CTA */}
            <div className="mobile-sticky-footer">
                <div className="ms-info">
                    <div className="ms-img">
                        <Image
                            src={casino.logoUrl || "/placeholder.png"}
                            alt=""
                            width={40} height={40}
                            style={{ borderRadius: "8px" }}
                        />
                    </div>
                    <div className="ms-text">
                        <span>Bonus exclusif</span>
                        <strong>{casino.name}</strong>
                    </div>
                </div>
                <a href={ctaHref} className="btn-shine small">Jouer</a>
            </div>
        </div>
    );
}