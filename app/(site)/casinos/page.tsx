import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import Bg from "@/components/Bg";
import Stars from "@/components/Stars";
import { prisma } from "@/lib/db";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "";

// ISR: Обновление статики раз в минуту.
// Убрали "force-dynamic", так как он конфликтует с revalidate и убивает производительность.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
    const top = await prisma.casino.findFirst({
        where: { rating: { not: null } },
        orderBy: { rating: "desc" },
        select: { name: true, shortDesc: true, slug: true, logoUrl: true },
    });

    // Добавляем актуальный год для SEO кликабельности
    const currentYear = new Date().getFullYear();
    const defaultTitle = `Tous les casinos en ligne — France vérifiés ${currentYear}`;
    const defaultDesc =
        "Découvrez tous les casinos en ligne vérifiés en France. Classement par note, bonus et fiabilité. Jouez sur des sites de confiance sélectionnés par nos experts.";

    const description = top && top.shortDesc ? top.shortDesc : defaultDesc;
    const ogImage = top?.logoUrl ? top.logoUrl : `${siteUrl}/logo.webp`;
    const url = `${siteUrl}/casinos`;

    return {
        title: defaultTitle,
        description,
        openGraph: {
            title: defaultTitle,
            description,
            url,
            siteName,
            type: "website",
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: top ? `${top.name} — ${siteName}` : `${siteName} — Casinos`,
                },
            ],
        },
        alternates: {
            canonical: url,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function CasinosPage() {
    const casinos = await prisma.casino.findMany({
        where: { rating: { not: null } },
        orderBy: { rating: "desc" },
        include: {
            links: { where: { isPrimary: true }, take: 1 },
            categories: true,
        },
    });

    // Генерируем Schema.org для списка (ItemList)
    // Это говорит Google, что перед ним ранжированный рейтинг казино
    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": casinos.map((casino, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "Organization", // Или "Casino" если схема поддерживает
                "name": casino.name,
                "image": casino.logoUrl,
                "url": `${siteUrl}/casinos/${casino.slug}`
            }
        }))
    };

    return (
        <div className="Home">
            {/* Вставляем JSON-LD Schema */}
            <Script
                id="casinos-list-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
            />

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
                    <p className="home-hero__subtitle" style={{ fontSize: '0.9rem', margin: 0 }}>
                        Triés par note décroissante
                    </p>
                </div>

                {casinos.length > 0 ? (
                    <div className="casino-grid">
                        {casinos.map((c: any) => {
                            const primary = c.links?.[0];
                            const ctaHref = primary
                                ? `/out/${primary.id}?source=all_casinos`
                                : `/casinos/${c.slug}`;

                            return (
                                <article key={c.id} className="content casino-card__container">
                                    {/* ВАЖНО: style={{ position: "relative" }} обязателен, 
                                      чтобы next/image с fill заполнил этот блок, не ломая верстку 
                                    */}
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
                                        <div className="casino-card__rating">
                                            <Stars
                                                value={c.rating}
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
                                        <a className="btn btn--primary" href={ctaHref} rel="nofollow noopener" target="_blank">
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