// app/categories/[slug]/page.tsx
import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type ParamsP = Promise<{ slug?: string | string[] } | undefined>;
const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

// ─── SEO META ────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: ParamsP }): Promise<Metadata> {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) return {};

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: true,
            _count: { select: { casinos: true } },
        },
    });

    if (!category) return {};

    const count = category._count.casinos;
    const title = `${category.name} — Casinos en ligne France`;
    const description = `Découvrez les meilleurs casinos en ligne de la catégorie "${category.name}" ${category.parent ? `(${category.parent.name}) ` : ""
        }avec ${count} site${count > 1 ? "s" : ""} vérifié${count > 1 ? "s" : ""}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `${siteUrl}/categories/${category.slug}`,
        },
        alternates: {
            canonical: `${siteUrl}/categories`,
        },
    };
}

// ─── PAGE ────────────────────────────────────────────────────
export default async function CategoryPage({ params }: { params: ParamsP }) {
    const p = (await params) ?? {};
    const slug = first(p.slug);
    if (!slug) notFound();

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            parent: true,
            children: true,
            casinos: {
                include: {
                    links: { where: { isPrimary: true }, take: 1 },
                },
                orderBy: { rating: "desc" },
            },
        },
    });

    if (!category) notFound();

    const { children, casinos } = category;

    return (
        <div className="Home">
            <Bg />

            <section className="home-hero container">
                <h1 className="home-hero__title">
                    {category.name}{" "}
                    {category.parent && (
                        <span className="home-hero__subtitle">
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
                        {children.map((c) => (
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
                        <h2>Casinos dans cette catégorie</h2>
                    </div>

                    <div className="casino-grid">
                        {casinos.map((c) => {
                            const primary = c.links?.[0];
                            const ctaHref = primary
                                ? `/out/${primary.id}?source=category`
                                : `/casinos/${c.slug}`;

                            return (
                                <article key={c.id} className="content casino-card__container">
                                    <div className="casino-card__logo" aria-hidden>
                                        <img src={c.logoUrl!} alt={c.name} />
                                    </div>

                                    <div className="casino-card__meta">
                                        <h3 className="casino-card__title">
                                            <a href={`/casinos/${c.slug}`}>{c.name}</a>
                                        </h3>
                                        <div className="casino-card__rating">
                                            <div className="stars">
                                                {Array.from({ length: 5 }).map((_, i) => {
                                                    const filled = (c.rating ?? 0) / 20 > i;
                                                    return (
                                                        <svg
                                                            key={i}
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill={filled ? "#0075ff" : "#9aa1b1"}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {c.shortDesc && (
                                        <p className="casino-card__desc">{c.shortDesc}</p>
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
                <p className="container empty">Aucun casino dans cette catégorie pour l’instant.</p>
            )}
        </div>
    );
}
