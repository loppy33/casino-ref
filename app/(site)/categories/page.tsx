// app/categories/page.tsx
export const dynamic = "force-dynamic";

import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Toutes les catégories — Casinos en ligne France",
    description:
        "Découvrez toutes les catégories de casinos en ligne France : bonus, jeux, dépôts minimum et plus. Trouvez le meilleur casino selon vos préférences.",
    openGraph: {
        title: "Toutes les catégories — Casinos en ligne France",
        description:
            "Liste complète des catégories de casinos en ligne vérifiés en France. Choisissez celle qui correspond à votre style de jeu.",
        type: "website",
        url: `${siteUrl}/categories`,
    },
    alternates: {
        canonical: `${siteUrl}/categories`,
    },
};

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        orderBy: {
            casinos: {
                _count: "desc",
            },
        },
        include: {
            _count: { select: { casinos: true } },
            parent: true,
        },
    });
    return (
        <div className="Home">
            <Bg />

            <section className="home-hero container">
                <h1 className="home-hero__title">
                    Toutes les <span>catégories</span> de casinos
                </h1>
                <p className="home-hero__subtitle">
                    Explorez toutes les catégories de casinos en ligne France pour trouver les meilleurs bonus,
                    les plateformes les plus fiables et des jeux adaptés à vos goûts.
                </p>
            </section>

            <section className="home-section container">
                <div className="section-head">
                    <h2>Liste complète des catégories</h2>
                </div>

                {categories.length > 0 ? (
                    <div className="cat-grid">
                        {categories.map((c: any) => (
                            <a key={c.id} href={`/categories/${c.slug}`} className="cat-card">
                                <span className="cat-card__dot" />
                                <span className="cat-card__name">{c.name}</span>
                                <span className="cat-card__count">{c._count.casinos}</span>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="empty">Aucune catégorie trouvée pour le moment.</p>
                )}
            </section>
        </div>
    );
}
