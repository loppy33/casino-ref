// app/casinos/page.tsx
import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Tous les casinos en ligne — France vérifiés",
    description:
        "Découvrez tous les casinos en ligne vérifiés en France. Classement par note, bonus et fiabilité. Jouez sur des sites de confiance sélectionnés par nos experts.",
    openGraph: {
        title: "Tous les casinos en ligne — France vérifiés",
        description:
            "Liste complète des casinos en ligne en France, triés par note et fiabilité. Choisissez le meilleur site pour jouer en toute sécurité.",
        type: "website",
        url: `${siteUrl}/casinos`,
    },
    alternates: {
        canonical: `${siteUrl}/casinos`,
    },
};

export default async function CasinosPage() {
    const casinos = await prisma.casino.findMany({
        where: { rating: { not: null } },
        orderBy: { rating: "desc" },
        include: {
            links: { where: { isPrimary: true }, take: 1 },
            categories: true,
        },
    });

    return (
        <div className="Home">
            <Bg />

            <section className="home-hero container">
                <h1 className="home-hero__title">
                    Tous les <span>casinos</span> en ligne France
                </h1>
                <p className="home-hero__subtitle">
                    Parcourez la liste complète des meilleurs casinos en ligne vérifiés en France. Tous sont
                    testés pour leur fiabilité, rapidité de retrait et qualité de bonus.
                </p>
            </section>

            <section className="home-section container">
                <div className="section-head">
                    <h2>Classement des casinos</h2>
                    <p className="home-hero__subtitle">Triés par note décroissante</p>
                </div>

                {casinos.length > 0 ? (
                    <div className="casino-grid">
                        {casinos.map((c) => {
                            const primary = c.links?.[0];
                            const ctaHref = primary
                                ? `/out/${primary.id}?source=all`
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
                ) : (
                    <p className="empty">Aucun casino trouvé pour le moment.</p>
                )}
            </section>
        </div>
    );
}
