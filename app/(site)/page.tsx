export const dynamic = "force-dynamic";

import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import { mdToPlain } from "@/utils/mdToPlain";

export default async function Home() {
	// грузим всё параллельно
	const [topCasinos, popularCategories, latestArticles] = await Promise.all([
		prisma.casino.findMany({
			where: { rating: { not: null } },
			orderBy: { rating: "desc" },
			take: 4,
			include: {
				links: { where: { isPrimary: true }, take: 1 },
			},
		}),
		prisma.category.findMany({
			take: 4,
			orderBy: { casinos: { _count: "desc" } }, // популярные по числу казино
			include: { _count: { select: { casinos: true } } },
		}),
		prisma.article.findMany({
			where: { published: true },
			orderBy: { createdAt: "desc" },
			take: 4,
		}),
	]);

	return (
		<div className="Home">
			<Bg />
			{/* HERO */}
			<section className="home-hero container">
				<h1 className="home-hero__title">
					Jouez sur les casinos en ligne <span>France vérifiés</span>
				</h1>
				<p className="home-hero__subtitle">
					Profitez des meilleurs casinos en ligne France, avec des bonus transparents et des retraits rapides. Chaque site est sélectionné pour sa fiabilité et son cadre de jeu sécurisé. Jouez en toute confiance et recevez vos gains sans délai.
				</p>

				<div className="home-hero__stats">
					<div className="stat">
						<div className="stat__num">{topCasinos.length}</div>
						<div className="stat__label">Casinos mis en avant</div>
					</div>
					<div className="stat">
						<div className="stat__num">{popularCategories.length}</div>
						<div className="stat__label">Catégories populaires</div>
					</div>
					<div className="stat">
						<div className="stat__num">{latestArticles.length}</div>
						<div className="stat__label">Articles récents</div>
					</div>
				</div>
			</section>

			{/* CATEGORIES */}
			{popularCategories.length > 0 && (
				<section className="home-section container">
					<div className="section-head">
						<h2>Catégories populaires</h2>
						<a className="section-head__link" href="/categories">Toutes les catégories →</a>
					</div>

					<div className="cat-grid">
						{popularCategories.map((c) => (
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
						<a className="section-head__link" href="/casinos">Voir tout →</a>
					</div>

					<div className="casino-grid">
						{topCasinos.map((c) => {
							const primary = c.links?.[0];
							const ctaHref = primary ? `/out/${primary.id}?source=seo` : `/casinos/${c.slug}`;
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

									{c.shortDesc && <p className="casino-card__desc">{c.shortDesc}</p>}

									<div className="casino-card__actions">
										<a className="btn btn--primary" href={ctaHref}>Jouer maintenant</a>
										<a className="btn btn--ghost" href={`/casinos/${c.slug}`}>Détails</a>
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
						<a className="section-head__link" href="/articles">Tous les articles →</a>
					</div>

					<div className="article-grid">
						{latestArticles.map((a) => (
							<article key={a.id} className="article-card">
								<h3 className="article-card__title">
									<a href={`/articles/${a.slug}`}>{a.title}</a>
								</h3>
								<p className="article-card__excerpt">
									{mdToPlain(a.bodyMd).slice(0, 120)}{a.bodyMd.length > 120 ? "…" : ""}
								</p>
								<a className="article-card__more" href={`/articles/${a.slug}`}>Lire →</a>
							</article>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
