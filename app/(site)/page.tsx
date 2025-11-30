export const dynamic = "force-dynamic";

import Bg from "@/components/Bg";
import { prisma } from "@/lib/db";
import MarkdownIt from "markdown-it";

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
			take: 8,
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
					Profitez des meilleurs casinos en ligne France, avec des bonus transparents et des retraits rapides.
					Chaque site est sélectionné pour sa fiabilité et son cadre de jeu sécurisé. Jouez en toute confiance et
					recevez vos gains sans délai.
				</p>
				{/* SEO-текст */}
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
						<a className="section-head__link" href="/casinos">
							Voir tout →
						</a>
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
						{latestArticles.map((a) => {
							const htmlPreview = getMarkdownPreview(a.bodyMd, 1500);

							return (
								<article key={a.id} className="article-card">
									<h3 className="article-card__title">
										<a href={`/articles/${a.slug}`}>{a.title}</a>
									</h3>

									<article
										className="article-card"
									>
										<div className="prose" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
									</article>

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
